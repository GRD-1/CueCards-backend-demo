import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CueCardsError, ErrorToHttpInterface, GlobalExceptionType } from '@/filters/errors/error.types';
import { PRISMA_ERR_TO_HTTP } from '@/filters/errors/prisma-error.registry';
import { CCBK_ERR_TO_HTTP, CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: GlobalExceptionType, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    let responsePayload: ErrorToHttpInterface = { ...CCBK_ERR_TO_HTTP[CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR] };
    let tempErrorPayload: ErrorToHttpInterface;

    switch (true) {
      case exception instanceof CueCardsError:
        responsePayload = { ...CCBK_ERR_TO_HTTP[(exception as CueCardsError).code] };
        responsePayload.errorMsg = `${responsePayload.errorMsg}: ${(exception as CueCardsError).message}`;
        this.logger.error(exception);
        break;

      case exception instanceof HttpException:
        responsePayload.statusCode = (exception as HttpException).getStatus();
        responsePayload.errorMsg = (exception as HttpException).message;
        if (responsePayload.statusCode === HttpStatus.NOT_FOUND) {
          responsePayload.errorMsg = `The path was not found: ${responsePayload.errorMsg}`;
        }
        this.logger.error(exception);
        break;

      case exception instanceof Prisma.PrismaClientKnownRequestError:
        tempErrorPayload = PRISMA_ERR_TO_HTTP[(exception as Prisma.PrismaClientKnownRequestError).code];
        if (tempErrorPayload) {
          responsePayload = { ...tempErrorPayload };
        }
        this.logger.error({ ...exception }, 'Prisma query failed!');
        break;

      case exception instanceof Prisma.PrismaClientValidationError:
        this.logger.error({ ...exception }, 'Prisma validation error!');
        break;

      default:
        this.logger.error(exception, 'Unknown exception');
        break;
    }

    response.status(responsePayload.statusCode).send(responsePayload);
  }
}
