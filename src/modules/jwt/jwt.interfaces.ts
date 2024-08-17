import * as jwt from 'jsonwebtoken';
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { UserWithCredentialsEntity } from '@/modules/user/user.entity';

export enum TokenTypeEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'resetPassword'
}

export interface ITokenBase {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  sub: string;
}

export interface IAccessPayload {
  id: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}

export interface IEmailPayload extends IAccessPayload {
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}

export interface IRefreshPayload extends IEmailPayload {
  tokenId: string;
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}

export interface IGenerateTokenAsyncArgs {
  payload: IAccessPayload | IEmailPayload | IRefreshPayload;
  secret: string;
  options: jwt.SignOptions;
}

export interface IVerifyTokenArgs {
  token: string;
  secret: string;
  options: jwt.VerifyOptions;
}

export type VerifyTokenType = string | Jwt | JwtPayload | undefined;

export type TokenType = IAccessToken | IRefreshToken | IEmailToken;

export type PayloadType = IAccessPayload | IEmailPayload | IRefreshPayload;

export interface IGenerateTokenArgs {
  user: UserWithCredentialsEntity;
  tokenType: TokenTypeEnum;
  domain?: string | null;
  tokenId?: string;
}
