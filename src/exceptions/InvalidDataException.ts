import { BaseException } from './BaseException';

export class InvalidDataException extends BaseException {
  constructor(
    message: string = 'Dados inválidos',
    status: number = 400,
    errorCode: string = 'INVALID_DATA',
  ) {
    super(message, status, errorCode);
  }
}
