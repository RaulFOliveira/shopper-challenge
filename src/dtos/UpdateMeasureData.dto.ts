import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateMeasureData {
  @IsNotEmpty({ message: 'O UUID da leitura deve ser informado' })
  @IsUUID(undefined, { message: 'O UUID da leitura deve ser um UUID válido' })
  measure_uuid: string;

  @IsNotEmpty({ message: 'O valor da leitura deve ser informado' })
  @IsNumber(undefined, { message: 'O valor da leitura deve ser um número' })
  confirmed_value: number;
}
