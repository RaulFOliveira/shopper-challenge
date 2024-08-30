import isBase64 from 'is-base64';
import AWS from 'aws-sdk';
import fs from 'fs-extra';
import path from 'path';
import 'dotenv/config'
import CreateLeituraDTO from "../dtos/CreateLeituraDTO";
import { DoubleReportError } from "../errors/DoubleReportError";
import InvalidDataError from "../errors/InvalidDataError";
import prisma from "../prisma";
import { MeasureType } from "@prisma/client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import BaseError from '../errors/BaseError';

interface CreateLeituraProps {
    image: string,
    customer_code: string,
    measure_datetime: Date,
    measure_type: MeasureType
}

interface CreateLeituraData {
    image_url: string,
    measure_value: number,
    measure_uuid: string
}

interface CreateURLProps {
    image: string,
    measure_datetime: Date,
    customer_code: string,
    measure_type: MeasureType
}

AWS.config.update({
    region: 'us-east-2'
});

const s3 = new AWS.S3();

export default class CreateLeituraService {
    
    async execute({ image, customer_code, measure_datetime, measure_type }: CreateLeituraProps): Promise<CreateLeituraDTO> {
        try {
            if (!customer_code || !image || !measure_datetime || !measure_type) {
                throw new InvalidDataError("Preencha todos os campos.")
            }

            if (!isBase64(image)) {
                throw new InvalidDataError("Imagem inválida. Verifique se o Base64 está correto.")
            }

            measure_type = measure_type.toUpperCase() as MeasureType
            if (measure_type !== MeasureType.WATER && measure_type !== MeasureType.GAS) {
                throw new InvalidDataError("Tipo de leitura inválido. Deve ser WATER ou GAS")
            }

            const leituras = await prisma.leitura.findMany({
                select: {
                    measure_datetime: true,
                },
                where: {
                    measure_type,
                    customer_code
                }
            })

            const dateObj = await this.stringToDate(measure_datetime.toString())
            leituras.find((leitura) => leitura.measure_datetime === dateObj)
            
            if (leituras.length) {
                throw new DoubleReportError()
            }
            
            const measureValue = await this.extractValueFromImage(image)
            const imageUrl = await this.createImageUrl({ image, measure_datetime, customer_code, measure_type })
            const { image_url, measure_value, measure_uuid } = await prisma.leitura.create({
                data: {
                    image_url: imageUrl,
                    customer_code,
                    measure_datetime: dateObj,
                    measure_type,
                    measure_value: Number(measureValue),
                }
            }) as CreateLeituraData;
            return new CreateLeituraDTO({ image_url, measure_value, measure_uuid });
        } catch (error: BaseError | any) {
            console.log(error.message)
            throw error;
        }
    }
    
    async stringToDate(date: string): Promise<Date> {
        const [day, month, year] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    async createImageUrl({ image, measure_datetime, customer_code, measure_type }: CreateURLProps): Promise<string> {
        const fileName = `image-${measure_datetime}-${customer_code}.jpeg`
        const filePath = path.join(__dirname, fileName);

        await fs.writeFile(filePath, image, { encoding: 'base64' });
        
        try {
            const fileContent = await fs.readFile(filePath);
            const params: AWS.S3.Types.PutObjectRequest = {
                Bucket: `shopper-images-test/${measure_type}`,
                Key: fileName,
                Body: fileContent,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
            };
    
            await s3.upload(params).promise();

            const signedUrl = s3.getSignedUrl('getObject', {
                Bucket: "shopper-images-test",
                Key: `${measure_type}/${fileName}`,
                Expires: 300
            });
    
            return signedUrl;
        } catch (error) {
            console.error('Falha ao enviar imagem ao S3:', error);
            throw error;
        } finally {
            await fs.remove(filePath);
        }
    }

    async extractValueFromImage(image: string): Promise<string> {
        try { 
           const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
           const result = await model.generateContent([
               {
                   inlineData: {
                       mimeType: "image/jpeg",
                       data: image
                    }
                },
                {
                    text: "Me retorne apenas o número descrito neste gasometro ou hidrometro, sem texto nenhum."
                }
            ]);

            const text = result.response.text();
            
            const confirmedValue = Number(text)
            if (isNaN(confirmedValue)) {
                throw new BaseError("Erro no valor extraído da imagem pela IA. Tente novamente.")
            }

            return confirmedValue.toFixed(0)
        } catch (error) {
            console.log(error)
            throw new BaseError("Erro ao tentar extrair o valor da imagem. Tente novamente.")
        }
    }
}