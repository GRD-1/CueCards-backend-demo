import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as process from 'process';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    let targetRegExp = /\/home/gi;
    let localProjectRoot = process.env.LOCAL_PROJECT_ROOT ? process.env.LOCAL_PROJECT_ROOT : '/home';
    if (process.env.DOCKER_MODE) {
      targetRegExp = /\/projectFiles/gi;
      localProjectRoot = process.env.LOCAL_PROJECT_ROOT_DOCKER ? process.env.LOCAL_PROJECT_ROOT_DOCKER : '/projectRoot';
    }

    const logger = new Logger('CustomException');
    const localStack = exception?.stack?.replace(targetRegExp, localProjectRoot);
    logger.error(localStack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionIsHandled = exception instanceof HttpException;
    const status = exceptionIsHandled ? exception.getStatus() : 500;
    const message = exceptionIsHandled ? exception.getResponse() : 'internal server error';
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
