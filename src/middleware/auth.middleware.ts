import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import config from '@/config/config.service';
import { ExpressRequestInterface } from '@/types/express-request.type';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const secret = config.JWT_SECRET;
    try {
      const decodeToken = verify(token, secret) as JwtPayload;
      if (decodeToken.id) req.user = await this.userService.findById(decodeToken.id);
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
