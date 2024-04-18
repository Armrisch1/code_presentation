import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DIRECTORY_FILE_NOT_FOUND_MESSAGE,
  IS_PRODUCTION,
  NOT_FOUND_PAGE_PATH,
  SERVER_ERROR_MESSAGE,
} from 'constants/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: Array<string> | string;

    message = (exception?.getResponse && exception.getResponse()?.message) || [exception?.message];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (status >= 500 && IS_PRODUCTION) {
      message = SERVER_ERROR_MESSAGE;
    }

    if (exception?.errors?.length) {
      message = `${exception.errors[0].message} provided value = ${exception.errors[0].value}`;
    }

    if (message instanceof Array) {
      message = message[0];
    }

    if (message.startsWith(DIRECTORY_FILE_NOT_FOUND_MESSAGE)) {
      return response.sendFile(NOT_FOUND_PAGE_PATH);
    }

    response.status(status).json({
      status,
      message,
      resData: null,
    });

    console.error({
      body: request.body,
      time: new Date(),
      query: request.query,
      errorMessage: message,
      errorLine: exception?.response?.path || exception?.request?.path,
      stackTrace: exception.stack,
    });
  }
}
