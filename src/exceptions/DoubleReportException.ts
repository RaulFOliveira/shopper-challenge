import { BaseException } from './BaseException';

export class DoubleReportException extends BaseException {
  constructor(
    message: string = 'Leitura do mês já realizada',
    status: number = 409,
    errorCode: string = 'DOUBLE_REPORT',
  ) {
    super(message, status, errorCode);
  }
}
