export class UserEntity {
  id: number;
  email: string;
  nickname: string;
  avatar: string | null;
  confirmed: boolean;
}

export class UserWithCredentialsEntity extends UserEntity {
  credentials: CredentialsEntity | null;
}

export class CredentialsEntity {
  userId: number;
  version = 0;
  password: string;
  lastPassword: string;
  updatedAt: Date;
}
