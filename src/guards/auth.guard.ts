import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CustomJwtPayload, TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { RequestInterface } from '@/types/request.type';
import { appConfig, jwtConfig, nodeConfig, userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { v4 } from 'uuid';
import { UNAUTHORIZED_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(nodeConfig.KEY)
    private nodeConf: ConfigType<typeof nodeConfig>,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
    }

    const parts = authorizationHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : null;

    if (this.nodeConf.mode === 'development' && token === this.userConf.testUserPassword) {
      this.useDeveloperSettings(request);

      return true;
    }

    if (token) {
      const tokenPayload = await this.jwtService.verifyToken(token, TokenTypeEnum.ACCESS);
      await this.jwtService.isTokenBlacklisted(tokenPayload.jti);
      request.user = { id: tokenPayload.sub };
      request.tokenPayload = tokenPayload;

      return true;
    }
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
  }

  useDeveloperSettings(request: RequestInterface): void {
    const tokenPayload: CustomJwtPayload = {
      iss: this.appConf.id,
      sub: this.userConf.testUserId,
      exp: this.jwtConf.access.time,
      jti: v4(),
      version: 1,
    };
    request.user = { id: this.userConf.testUserId };
    request.tokenPayload = tokenPayload;
  }
}
