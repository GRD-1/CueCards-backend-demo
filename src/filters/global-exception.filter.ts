import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CueCardsError, ErrorToHttpInterface, GlobalExceptionType } from '@/filters/errors/error.types';
import { PRISMA_ERROR_TO_HTTP } from '@/filters/errors/prisma-error.registry';
import { CCBK_ERROR_CODES, CCBK_ERROR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: GlobalExceptionType, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    let responsePayload: ErrorToHttpInterface = CCBK_ERROR_TO_HTTP[CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR];

    if (exception instanceof CueCardsError) {
      responsePayload = CCBK_ERROR_TO_HTTP[exception.code];
      responsePayload.errorMsg = `${responsePayload.errorMsg}: ${exception.message}`;

      this.logger.error(exception);
    } else if (exception instanceof HttpException) {
      responsePayload.statusCode = exception.getStatus();
      responsePayload.errorMsg = exception.message;

      this.logger.error(exception);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errorPayload = PRISMA_ERROR_TO_HTTP[exception.code];

      if (errorPayload) {
        responsePayload = errorPayload;
      }

      this.logger.error({ ...exception }, 'Prisma query failed!');
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error({ ...exception }, 'Prisma validation error!');
    } else {
      this.logger.error(exception, 'Unknown exception');
    }

    response.status(responsePayload.statusCode).send(responsePayload);
  }
}
