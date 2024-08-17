import { IUser } from '@/modules/user/user.interface';
import { UserWithCredentialsEntity } from '@/modules/user/user.entity';

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateTokenArgs {
  user: UserWithCredentialsEntity;
  domain?: string | null;
  tokenId?: string;
}
