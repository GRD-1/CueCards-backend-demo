import { Request } from 'express';
import { UserEntity } from '../modules/user/entities/user.entity';

type RequestWithoutUser = Omit<Request, 'user'>

export interface ExpressRequestInterface extends RequestWithoutUser {
  user: UserEntity | null
}
