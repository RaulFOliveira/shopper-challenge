import { IsBase64, IsDate, IsEnum, IsString } from 'class-validator';

export class CreateMeasureData {
  @IsBase64(undefined, {
    message: 'Imagem inválida. Verifique se o Base64 está correto.',
  })
  image_url: string;

  @IsString({ message: 'Código do cliente deve ser uma texto' })
  customer_code: string;

  @IsDate({ message: 'Data da leitura deve ser uma data' })
  measure_datetime: Date;

  @IsString({ message: 'Tipo de leitura inválido. Deve ser WATER ou GAS' })
  @IsEnum(['WATER', 'GAS'], {
    message: 'Tipo de leitura inválido. Deve ser WATER ou GAS',
  })
  measure_type: string;
}
