import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { ErrorResponse } from '@/exception/error-response.interface';

export class ValidationException extends HttpException {
  constructor(private errors: ValidationError[]) {
    super('Validation Error', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  getResponse(): ErrorResponse[] {
    return this.errors.map((error) => {
      return {
        status: this.getStatus(),
        title: this.message,
        detail: error.constraints ? Object.values(error.constraints)[0] : undefined,
        source: {
          pointer: error.property,
        },
        children: error.children.length ? error.children : undefined,
      };
    });
  }
}
