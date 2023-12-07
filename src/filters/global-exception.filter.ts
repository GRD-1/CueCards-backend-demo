import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as process from 'process';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const logger = new Logger('CustomException');
    const targetRegExp = /\/projectFiles/gi;
    const localProjectRoot = process.env.LOCAL_PROJECT_ROOT ? process.env.LOCAL_PROJECT_ROOT : '/projectRoot';
    const localStack = exception?.stack?.replace(targetRegExp, localProjectRoot);
    logger.error(localStack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionIsHandled = exception instanceof HttpException;
    const status = exceptionIsHandled ? exception.getStatus() : 500;
    const message = exceptionIsHandled ? exception.message : 'internal server error';
    response
      .status(status)
      .json({
        statusCode: status,
        message
      });
  }
}
