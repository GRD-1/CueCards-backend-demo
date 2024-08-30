import { UserWithCredentialsEntity } from '@/modules/user/user.entity';

export enum EmailType {
  Confirmation = 'confirm',
  Reset = 'reset'
}

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateTokenArgs {
  user: UserWithCredentialsEntity;
  domain?: string | null;
  tokenId?: string;
}
