export class UsersEntity {
  login: string;
  email: string;
  avatar?: string;
  passwordHash?: string;
  refreshToken?: string;
  salt?: string;
}
