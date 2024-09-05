export class UserEntity {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  confirmed: boolean;
}

export class CredentialsEntity {
  userId: string;
  version = 0;
  password: string;
  lastPassword: string;
  updatedAt: Date;
}

export class UserWithCredentialsEntity extends UserEntity {
  credentials: CredentialsEntity | null;
}
