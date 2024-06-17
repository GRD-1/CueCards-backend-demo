import { Request } from 'express';
import { UserResponseDto } from '@/modules/user/interfaces/user-response.type';

type RequestWithoutUser = Omit<Request, 'user'>

export interface ExpressRequestInterface extends RequestWithoutUser {
  user: UserResponseDto | null
}
