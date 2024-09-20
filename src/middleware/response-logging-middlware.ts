import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';

@Injectable()
export class ResponseLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;
    res.send = (body): Response => {
      const logger = new Logger('HttpResponse');
      const msg = `${req.method} ${req.originalUrl}`;
      logger.debug(msg);
      logger.debug(`statusCode: ${res.statusCode}`);
      logger.debug(body);

      return originalSend.apply(res, [body]);
    };
    next();
  }
}
