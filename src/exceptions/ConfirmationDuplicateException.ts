import { BaseException } from './BaseException';

export default class ConfirmationDuplicateException extends BaseException {
  constructor(
    message: string = 'Leitura do mês já realizada',
    errorCode: string = 'CONFIRMATION_DUPLICATE',
  ) {
    super(message, 409, errorCode);
  }
}
