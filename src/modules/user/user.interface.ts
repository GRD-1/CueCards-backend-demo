export interface IUser {
  email: string;
  nickname: string;
  avatar: string | null;
}

export interface IUpdateUser {
  nickname: string;
  avatar: string | null;
}
