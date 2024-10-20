import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from 'src/exceptions/BaseException';
import ConfirmationDuplicateException from 'src/exceptions/ConfirmationDuplicateException';
import { DoubleReportException } from 'src/exceptions/DoubleReportException';
import { InvalidDataException } from 'src/exceptions/InvalidDataException';
import { InvalidTypeException } from 'src/exceptions/InvalidTypeException';
import { MeasureNotFoundException } from 'src/exceptions/MeasureNotFoundException';
import { MeasuresNotFoundException } from 'src/exceptions/MeasuresNotFoundException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof DoubleReportException) {
      exception.sendResponse(response);
    } else if (exception instanceof InvalidTypeException) {
      exception.sendResponse(response);
    } else if (exception instanceof InvalidDataException) {
      exception.sendResponse(response);
    } else if (exception instanceof MeasuresNotFoundException) {
      exception.sendResponse(response);
    } else if (exception instanceof MeasureNotFoundException) {
      exception.sendResponse(response);
    } else if (exception instanceof ConfirmationDuplicateException) {
      exception.sendResponse(response);
    } else if (exception instanceof BadRequestException) {
      response.status(exception.getStatus()).json({
        messages: exception.getResponse()['message'],
        status: 400,
        errorCode: 'INVALID_DATA',
      });
    } else if (exception instanceof BaseException) {
      exception.sendResponse(response);
    } else {
      response.status(500).json({ message: 'Erro interno', error: exception });
    }
  }
}
