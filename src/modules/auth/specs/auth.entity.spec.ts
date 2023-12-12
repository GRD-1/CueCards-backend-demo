import { AuthEntity } from '../entities/auth.entity';

describe('AuthModel', () => {
  it('should be defined', () => {
    expect(new AuthEntity()).toBeDefined();
  });
});
