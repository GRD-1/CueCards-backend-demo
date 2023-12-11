export class UsersModel {
  login: string;
  email: string;
  avatar?: string;
  passwordHash?: string;
  refreshToken?: string;
  salt?: string;
}
