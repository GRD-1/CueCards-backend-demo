import { UserEntity } from '../entities/user.entity';

export type UserType = Omit<
  UserEntity,
  'hashPassword' | 'password' | 'createdAt' | 'updateAt' | 'deleteMark' | 'cards' | 'updateTimestamp'
>;
