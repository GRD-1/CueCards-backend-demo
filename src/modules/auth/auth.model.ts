export class AuthModel {
  login: string;
  email: string;
  passwordHash?: string;
  refreshToken?: string;
  salt?: string;
}
