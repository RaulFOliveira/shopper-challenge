import { BaseException } from './BaseException';

export class InvalidTypeException extends BaseException {
  constructor(
    message: string = 'Tipo de medição não permitida',
    errorCode: string = 'INVALID_TYPE',
  ) {
    super(message, 400, errorCode);
  }
}
