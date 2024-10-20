import { BaseException } from './BaseException';

export class MeasuresNotFoundException extends BaseException {
  constructor(
    message: string = 'Nenhuma leitura encontrada',
    errorCode: string = 'MEASURES_NOT_FOUND',
  ) {
    super(message, 404, errorCode);
  }
}
