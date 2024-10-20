import { MeasureType } from '@prisma/client';
import { IsBase64, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsBrazilianDate } from 'src/validators/IsBrazilianDate.validator';

export class CreateMeasureData {
  @IsNotEmpty()
  @IsBase64(undefined, {
    message: 'Imagem inválida. Verifique se o Base64 está correto.',
  })
  image: string;

  @IsNotEmpty()
  @IsString({ message: 'Código do cliente deve ser uma texto' })
  customer_code: string;

  @IsNotEmpty()
  @IsBrazilianDate({
    message:
      'Data inválida. Verifique se o formato é dd-mm-yyyy e/ou se é uma data correta',
  })
  measure_datetime: Date;

  @IsNotEmpty()
  @IsEnum(MeasureType, {
    message: 'Tipo de leitura inválido. Deve ser WATER ou GAS',
  })
  measure_type: MeasureType;
}
