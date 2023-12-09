export class UserModel {
  login: string;
  avatar?: string;
  email: string;
  passwordHash?: string;
  refreshToken?: string;
  salt?: string;
}
