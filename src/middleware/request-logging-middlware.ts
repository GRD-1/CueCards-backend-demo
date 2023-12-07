import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, () => {
      const logger = new Logger('HttpRequest');
      const msg = `${req.method} ${req.originalUrl}`;
      logger.verbose(msg);
      logger.verbose(req.body);
    });
    next();
  }
}
