export interface IUser {
  email: string;
  nickname: string;
  avatar: string | null;
  password: string;
}

export interface IUserWithPassword extends IUser {
  password: string;
}
