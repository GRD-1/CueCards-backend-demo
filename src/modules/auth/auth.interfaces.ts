import { UserWithCredentialsEntity } from '@/modules/user/user.entity';

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateTokenArgs {
  user: UserWithCredentialsEntity;
  domain?: string | null;
  tokenId?: string;
}
