export class AuthEntity {
  login: string;
  email: string;
  passwordHash?: string;
  refreshToken?: string;
  salt?: string;
}
