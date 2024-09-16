import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ResponseBody = {
  status: number;
  message: string;
  errorCode: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() || 'Internal server error';
    }

    console.error('Exception caught:', exception);

    const responseBody: ResponseBody = {
      status,
      message: typeof message === 'string' ? message : (message as any).message,
      errorCode: request.url,
    };

    response.status(status).json(responseBody);
  }
}
