import { BaseException } from './BaseException';

export class MeasureNotFoundException extends BaseException {
  constructor(
    message: string = 'Leitura não encontrada',
    errorCode: string = 'MEASURE_NOT_FOUND',
  ) {
    super(message, 404, errorCode);
  }
}
