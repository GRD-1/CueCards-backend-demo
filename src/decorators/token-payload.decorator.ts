import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { RequestInterface } from '@/types/request.type';
import { CustomJwtPayload } from '@/modules/jwt/jwt.interfaces';
import { UNAUTHORIZED_ERR_MSG } from '@/constants/messages.constants';

export const TokenPayload = createParamDecorator((data: string, ctx: ExecutionContext): CustomJwtPayload => {
  const request = ctx.switchToHttp().getRequest<RequestInterface>();
  if (!request.tokenPayload) {
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
  }

  return request.tokenPayload;
});
