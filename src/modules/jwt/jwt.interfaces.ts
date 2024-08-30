import * as jwt from 'jsonwebtoken';
import { UserWithCredentialsEntity } from '@/modules/user/user.entity';

export enum TokenTypeEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'resetPassword'
}

export interface ITokenPayload {
  userUuid: string;
  version: number;
  tokenId: string;
}

export interface IGenerateTokenAsyncArgs {
  payload: ITokenPayload;
  secret: string;
  options: jwt.SignOptions;
}

export interface IVerifyTokenArgs {
  token: string;
  secret: string;
  options: jwt.VerifyOptions;
}

export interface IGenerateTokenArgs {
  user: UserWithCredentialsEntity;
  tokenType: TokenTypeEnum;
  domain?: string | null;
  tokenId?: string;
}
