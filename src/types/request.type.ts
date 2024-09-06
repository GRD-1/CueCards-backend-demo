import { Request } from 'express';
import { CustomJwtPayload } from '@/modules/jwt/jwt.interfaces';

type RequestWithoutUser = Omit<Request, 'user'>;

export interface RequestInterface extends RequestWithoutUser {
  user: { id?: string };
  tokenPayload: CustomJwtPayload;
}
