import { Request } from 'express';
import { UserResponseDto } from '@/modules/user/user.dto';

type RequestWithoutUser = Omit<Request, 'user'>;

export interface ExpressRequestInterface extends RequestWithoutUser {
  user: UserResponseDto | null;
}
