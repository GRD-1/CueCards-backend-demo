import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ExpressRequestInterface } from '../types/express-request.type';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const secret = this.configService.get('JWT_SECRET');
      const decodeToken = verify(token, secret) as JwtPayload;
      if (decodeToken.id) req.user = await this.userService.findById(decodeToken.id);
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
