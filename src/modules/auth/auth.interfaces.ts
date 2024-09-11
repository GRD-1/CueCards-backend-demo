import { IUser } from '@/modules/user/user.interface';

export interface IUserWithPassword extends IUser {
  password: string;
}

export enum EmailType {
  Confirmation = 'confirm',
  Reset = 'reset',
}

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateTokenArgs {
  userId: string;
  version: number;
  domain?: string | null;
  tokenId?: string;
}

export interface IUpdatePasswordArgs extends IAuthResult {
  currentPassword: string;
  newPassword: string;
}
