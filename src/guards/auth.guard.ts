import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { ExpressRequestInterface } from '../types/express-request.type';
import { UNAUTHORISED } from '../modules/user/user.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>();
    if (request.user) return true;
    throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'user is not authorised');
  }
}
