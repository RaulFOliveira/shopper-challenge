import { Injectable } from '@nestjs/common';
import { MeasureType } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as AWS from 'aws-sdk';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { PrismaService } from './prisma.service';
import { InvalidTypeException } from 'src/exceptions/InvalidTypeException';
import { CreateMeasureData } from 'src/dtos/CreateMeasureData.dto';
import { BaseException } from 'src/exceptions/BaseException';
import { MeasuresNotFoundException } from 'src/exceptions/MeasuresNotFoundException';
import ListLeitura from 'src/dtos/ListLeitura.dto';
import { InvalidDataException } from 'src/exceptions/InvalidDataException';
import CreatedMeasure from 'src/dtos/CreatedMeasure.dto';
import { DoubleReportException } from 'src/exceptions/DoubleReportException';
import { UpdateMeasureData } from 'src/dtos/UpdateMeasureData.dto';
import { MeasureNotFoundException } from 'src/exceptions/MeasureNotFoundException';
import ConfirmationDuplicateException from 'src/exceptions/ConfirmationDuplicateException';

interface ListLeituraProps {
  customerCode: string;
  measureType?: MeasureType;
}

interface SearchParamsProps {
  customer_code: string;
  measure_type?: MeasureType;
}

interface CreateURLProps {
  image: string;
  measure_datetime: Date;
  customer_code: string;
  measure_type: MeasureType;
}

interface SearchParamsProps {
  customer_code: string;
  measure_type?: MeasureType;
}

AWS.config.update({
  region: 'us-east-2',
});

const s3 = new AWS.S3();

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async upload({
    image,
    customer_code,
    measure_datetime,
    measure_type,
  }: CreateMeasureData): Promise<CreatedMeasure> {
    try {
      measure_type = measure_type.toUpperCase() as MeasureType;
      const isValidMeasureType =
        measure_type === 'WATER' || measure_type === 'GAS';

      if (!isValidMeasureType) {
        throw new InvalidDataException(
          'Tipo de leitura inválido. Deve ser WATER ou GAS',
        );
      }

      const leituras = await this.prisma.leitura.findMany({
        select: {
          measure_datetime: true,
        },
        where: {
          measure_type,
          customer_code,
        },
      });

      const dateObj = await this.stringToDate(measure_datetime.toString());
      const measureAlreadyExistsInDate = leituras.find((leitura) => {
        if (leitura.measure_datetime.getTime() === dateObj.getTime()) {
          return leitura;
        }
      });

      if (measureAlreadyExistsInDate) {
        throw new DoubleReportException();
      }

      const measureValue = await this.extractValueFromImage(image);
      const imageUrl = await this.createImageUrl({
        image,
        measure_datetime,
        customer_code,
        measure_type,
      });
      const { image_url, measure_value, measure_uuid } =
        await this.prisma.leitura.create({
          data: {
            image_url: imageUrl,
            customer_code,
            measure_datetime: dateObj,
            measure_type,
            measure_value: Number(measureValue),
          },
        });
      return new CreatedMeasure({ image_url, measure_value, measure_uuid });
    } catch (error: BaseException | any) {
      console.log(error.message);
      throw error;
    }
  }

  async extractValueFromImage(image: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY as string,
      );

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ];

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
      });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: image,
          },
        },
        {
          text: 'Me retorne apenas o número descrito neste gasometro ou hidrometro, sem texto nenhum.',
        },
      ]);

      const text = result.response.text();
      const textFormatted = await this.formatText(text);
      const imageValue = Number(textFormatted);
      return imageValue.toFixed(0);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async formatText(text: string): Promise<string> {
    text = text.replace(/[^0-9]/g, '');

    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(text)) {
      throw new BaseException(
        'Erro no valor extraído da imagem pela IA. Tente novamente.',
      );
    }
    return text;
  }

  async createImageUrl({
    image,
    measure_datetime,
    customer_code,
    measure_type,
  }: CreateURLProps): Promise<string> {
    const fileName = `image-${measure_datetime}-${customer_code}.jpeg`;
    const filePath = path.join(__dirname, fileName);

    await fs.writeFile(filePath, image, { encoding: 'base64' });

    try {
      const bucketName = process.env.BUCKET_NAME as string;
      const fileContent = await fs.readFile(filePath);
      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: `${bucketName}/${measure_type}`,
        Key: fileName,
        Body: fileContent,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      await s3.upload(params).promise();

      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: 'shopper-images-test',
        Key: `${measure_type}/${fileName}`,
        Expires: 300,
      });

      return signedUrl;
    } catch (error) {
      console.error('Falha ao enviar imagem ao S3:', error);
      throw error;
    } finally {
      await fs.remove(filePath);
    }
  }
  async stringToDate(date: string): Promise<Date> {
    const [day, month, year] = date.split('-').map(Number);

    if (month < 1 || month > 12) {
      return null;
    }

    const dateFormatted = new Date(year, month - 1, day);
    if (day < 1 || day > dateFormatted.getDate()) {
      return null;
    }

    return dateFormatted;
  }

  async confirm({
    measure_uuid,
    confirmed_value,
  }: UpdateMeasureData): Promise<void> {
    const measure = await this.prisma.leitura.findUnique({
      where: { measure_uuid },
    });

    if (!measure) {
      throw new MeasureNotFoundException();
    }

    if (measure.has_confirmed) {
      throw new ConfirmationDuplicateException();
    }

    await this.prisma.leitura.update({
      where: { measure_uuid },
      data: {
        measure_value: confirmed_value,
        has_confirmed: true,
      },
    });
  }

  async list({
    customerCode,
    measureType,
  }: ListLeituraProps): Promise<ListLeitura[]> {
    const search: SearchParamsProps = {
      customer_code: customerCode,
    };

    if (measureType) {
      measureType = measureType.toUpperCase() as MeasureType;
      const isInvalidType = !Object.values(MeasureType).includes(
        measureType as MeasureType,
      );
      if (isInvalidType) {
        throw new InvalidTypeException();
      }

      search.measure_type = measureType;
    }

    const leituras = await this.prisma.leitura.findMany({
      where: search,
      select: {
        measure_uuid: true,
        measure_datetime: true,
        measure_type: true,
        has_confirmed: true,
        image_url: true,
      },
    });

    if (!leituras.length) {
      throw new MeasuresNotFoundException();
    }

    return leituras.map((leitura) => new ListLeitura(leitura));
  }
}
