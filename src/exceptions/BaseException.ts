import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  errorCode: string;

  constructor(
    message: string = 'Erro interno do servidor, tente novamente.',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message, status);
    this.errorCode = errorCode;
  }
}
