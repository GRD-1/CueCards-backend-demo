import { HttpException, Injectable } from '@nestjs/common';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { UserInterface } from '@/modules/user/user.interface';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { compareSync } from 'bcrypt';
import { UserEntity, UserWithPasswordEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async create(payload: UserInterface): Promise<number> {
    const { email } = payload;
    const oldUser = await this.userRepo.findOneByEmail(email);
    if (oldUser) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A user with that email already exists');
    }
    const newUser = new UserWithPasswordEntity();
    Object.assign(newUser, payload);
    const user = await this.userRepo.create(newUser);

    // return this.buildUserResponseWithToken(user);
    return user.id;
  }

  async findOneById(id: number): Promise<UserEntity> {
    return this.userRepo.findOneById(id);
  }

  async login(email: string, password: string): Promise<number> {
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) {
      throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
    }
    const passwordIsValid = compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
    }

    // return this.buildUserResponseWithToken(user);
    return user.id;
  }

  async update(id: number, payload: Partial<UserInterface>): Promise<number> {
    const { email } = payload;
    const oldUser = await this.userRepo.findOneByEmail(email);
    if (oldUser && oldUser.id !== id) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A user with that email already exists');
    }

    const user = new UserEntity();
    Object.assign(user, payload);
    const updatedUser = await this.userRepo.update(id, payload);

    // return this.buildUserResponseWithToken(user);
    return updatedUser.id;
  }

  // async buildUserResponseWithToken(user: UserEntity): Promise<LoginUserResponse> {
  //   const token = await this.generateJwt(user);
  //   const { password, ...userWithoutPassword } = user;
  //
  //   return { ...userWithoutPassword, token };
  // }
  //
  // async generateJwt(user: UserEntity): Promise<string> {
  //   const secret = config.JWT_SECRET;
  //
  //   return sign(
  //     {
  //       id: user.id,
  //       login: user.nickname,
  //       email: user.email,
  //     },
  //     secret,
  //   );
  // }
}
