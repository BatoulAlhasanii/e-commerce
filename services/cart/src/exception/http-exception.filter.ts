import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from './validation.exception';
import { ErrorResponse } from '@/exception/error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errors: ErrorResponse[] =
      exception instanceof ValidationException
        ? exception.getResponse()
        : [
            {
              status: status,
              title: this.camelCaseToMessage(exception.name),
              detail: exception.message,
            },
          ];

    response.status(status).json({ errors });
  }

  private camelCaseToMessage(text: string) {
    const result = text.replace(/([A-Z])/g, ' $1');

    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
