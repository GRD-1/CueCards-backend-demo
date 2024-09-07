import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CustomJwtPayload, TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { RequestInterface } from '@/types/request.type';
import { appConfig, nodeConfig, userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';

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
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'User is not authorised');
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
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'User is not authorised');
  }

  useDeveloperSettings(request: RequestInterface): void {
    const tokenPayload: CustomJwtPayload = {
      iss: this.appConf.id,
      sub: this.userConf.testUserId,
      exp: 0,
      jti: this.userConf.testUserJti,
      version: 1,
    };
    request.user = { id: tokenPayload.sub };
    request.tokenPayload = tokenPayload;
  }
}
