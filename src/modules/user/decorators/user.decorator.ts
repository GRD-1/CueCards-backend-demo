import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestInterface } from '@/types/express-request.type';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  return { id: 1 };

  // const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();
  // if (!request.user) {
  //   return null;
  // }
  // const userData: { [key: string]: any } = request.user;
  // if (data) {
  //   return userData[data];
  // }
  //
  // return request.user;
});
