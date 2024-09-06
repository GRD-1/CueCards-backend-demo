import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestInterface } from '@/types/request.type';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: RequestInterface, res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      next();

      return;
    }

    const parts = authorizationHeader.split(' ');
    // if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    //   req.token = parts[1];
    // } else {
    //   req.token = authorizationHeader;
    // }
    //
    // try {
    //   req.tokenPayload = await this.jwtService.decodeJwt(req.token);
    // } catch (err) {
    //   throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid token');
    // }
    next();
  }
}
