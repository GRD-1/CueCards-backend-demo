import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { jwtConfig } from '@/config/configs';
import { ExpressRequestInterface } from '@/types/express-request.type';
import { UserService } from '@/modules/user/user.service';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) {
      req.user = null;
      next();

      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const secret = this.jwtConf.privateKey;
    try {
      const decodeToken = verify(token, secret) as JwtPayload;
      if (decodeToken.id) {
        req.user = await this.userService.findOneById(decodeToken.id);
      }
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
