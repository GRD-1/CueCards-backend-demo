import { Request } from 'express';
import { UserResponse } from '../modules/user/types/user-response.type';

type RequestWithoutUser = Omit<Request, 'user'>

export interface ExpressRequestInterface extends RequestWithoutUser {
  user: UserResponse | null
}
