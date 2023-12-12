import { UsersEntity } from '../entities/users.entity';

describe('UserModel', () => {
  it('should be defined', () => {
    expect(new UsersEntity()).toBeDefined();
  });
});
