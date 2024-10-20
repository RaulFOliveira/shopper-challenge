import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  protected errorCode: string;

  constructor(
    message: string = 'Erro interno do servidor, tente novamente.',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message, status);
    this.errorCode = errorCode;
  }

  getErrorCode() {
    return this.errorCode;
  }

  sendResponse(res: any) {
    const status = this.getStatus();

    return res.status(status).send({
      message: this.message,
      errorCode: this.errorCode,
      status: status,
    });
  }
}
