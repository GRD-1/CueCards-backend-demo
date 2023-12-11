import { UsersModel } from '../users.model';

describe('UserModel', () => {
  it('should be defined', () => {
    expect(new UsersModel()).toBeDefined();
  });
});
