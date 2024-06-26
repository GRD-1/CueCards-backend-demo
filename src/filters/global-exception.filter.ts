import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMA_ERR_TO_HTTP_ERR } from '@/filters/errors/prisma-error-codes';
import { Response } from 'express';

type ExceptionType = Error | HttpException | Prisma.PrismaClientKnownRequestError;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: ExceptionType, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    let httpStatusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let httpMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      httpStatusCode = exception.getStatus();
      httpMessage = exception.message;

      if (httpStatusCode === HttpStatus.FORBIDDEN) {
        httpStatusCode = HttpStatus.UNAUTHORIZED;
      }
      this.logger.error(exception);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const httpError = PRISMA_ERR_TO_HTTP_ERR[exception.code] || HttpStatus.NOT_ACCEPTABLE;
      httpStatusCode = httpError.code;
      httpMessage = httpError.msg;

      this.logger.warn({ ...exception }, 'Prisma query failed');
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      httpStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      const arr = exception.message.split('\n');
      httpMessage = arr[arr.length - 1];

      this.logger.warn({ ...exception }, 'Prisma query failed');
    } else {
      this.logger.error(exception, 'Unknown exception');
    }

    response.status(httpStatusCode).send({ error: true, code: httpStatusCode, message: httpMessage });
  }
}
