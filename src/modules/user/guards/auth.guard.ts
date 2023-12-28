import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequestInterface } from '../../../types/express-request.type';
import { UNAUTHORISED } from '../user.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>();
    if (request.user) return true;
    throw new HttpException(UNAUTHORISED, HttpStatus.UNAUTHORIZED);
  }
}
