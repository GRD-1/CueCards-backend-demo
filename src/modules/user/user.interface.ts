export interface IUser {
  email: string;
  nickname: string;
  avatar: string | null;
}

export interface IUserWithPassword extends IUser {
  password: string;
}
