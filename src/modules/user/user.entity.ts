export class UserEntity {
  id: number;
  nickname: string;
  email: string;
  avatar: string | null;
}

export class UserWithPasswordEntity extends UserEntity {
  password: string;
}
