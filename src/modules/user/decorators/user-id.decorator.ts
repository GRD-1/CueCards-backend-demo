import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { ExpressRequestInterface } from '@/types/express-request.type';

export const UserId = createParamDecorator((data: string, ctx: ExecutionContext): number => {
  return 1;

  // const request = ctx.switchToHttp().getRequest();
  // // if (!request.user) {
  // //   request.user = undefined;
  // // }
  // // const userData: { [key: string]: any } = request.user;
  // // if (data) {
  // //   return userData[data];
  // // }

  // // return request.user?.id;

  // const request = ctx.switchToHttp().getRequest();

  // return request.user?.id;
});
