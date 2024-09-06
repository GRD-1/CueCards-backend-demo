import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { JwtService } from '@/modules/jwt/jwt.service';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { RequestInterface } from '@/types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'User is not authorised');
    }

    const parts = authorizationHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : null;

    if (token) {
      const tokenPayload = await this.jwtService.verifyToken(token, TokenTypeEnum.ACCESS);
      await this.jwtService.isTokenBlacklisted(tokenPayload.jti);
      request.user = { id: tokenPayload.sub };
      request.tokenPayload = tokenPayload;

      return true;
    }
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'User is not authorised');
  }
}
