import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { RequestInterface } from '@/types/request.type';
import { UNAUTHORIZED_ERR_MSG } from '@/constants/messages.constants';

export const UserId = createParamDecorator((data: string, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<RequestInterface>();
  if (!request.user || !request.user.id) {
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
  }

  return request.user.id;
});
