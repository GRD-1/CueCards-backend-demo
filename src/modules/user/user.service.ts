import { Injectable } from '@nestjs/common';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { IUser, IUserWithPassword } from '@/modules/user/user.interface';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { hash } from 'bcrypt';
import { UserEntity, UserWithCredentialsEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async create(payload: IUserWithPassword): Promise<UserWithCredentialsEntity> {
    const { email, nickname, avatar, password } = payload;
    await this.checkEmailUniqueness(email);
    const hashedPass = await hash(password, 10);
    const userId = await this.userRepo.create({ email, avatar, password: hashedPass, nickname });

    return userId;
  }

  async findOneById(id: number): Promise<UserEntity> {
    return this.userRepo.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOneByEmail(email);
  }

  async update(id: number, payload: Partial<IUser>): Promise<number> {
    const { email } = payload;
    if (email) {
      await this.checkEmailUniqueness(email, id);
    }
    const updatedUser = await this.userRepo.update(id, payload);

    return updatedUser.id;
  }

  async confirm(email: string): Promise<number> {
    return this.userRepo.confirm(email);
  }

  // async updatePassword(userId: number, oldPass: string, newPass: string): Promise<UserWithCredentialsEntity> {
  //   const user = await this.userRepo.findOneById(userId);
  //   const hashedOldPass = await hash(oldPass, 10);
  //   const hashedNewPass = await hash(newPass, 10);
  //
  //   if (hashedOldPass !== user?.credentials?.password) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, 'Invalid password');
  //   }
  //   if (oldPass === newPass) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, 'New password must be different');
  //   }
  //
  //   await this.userRepo.updatePassword(userId, hashedOldPass, hashedNewPass);
  //
  //   return user;
  // }

  // async resetPassword(userId: number, version: number, password: string): Promise<UserWithCredentialsEntity> {
  //   const user = await this.findOneByCredentials(userId, version);
  //   user.credentials.updatePassword(user.password);
  //   user.password = await hash(password, 10);
  //
  //   return user;
  // }

  private async checkEmailUniqueness(email: string, userId?: number): Promise<void> {
    const user = await this.userRepo.findOneByEmail(email);
    if (user && user.id !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'This email address is already occupied');
    }
  }

  // public async findOneWithCredentials(id: number, version: number): Promise<UserWithCredentialsEntity | null> {
  //   const user = await this.userRepo.findOneById(id);
  //   if (isUndefined(user) || isNil(user) || user?.credentials?.version !== version) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid credentials');
  //   }
  //
  //   return user;
  // }

  public async delete(userId: number): Promise<number> {
    return this.userRepo.delete(userId);
  }

  // async login(email: string, password: string): Promise<number> {
  //   const user = await this.userRepo.findOneByEmail(email);
  //   if (!user) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
  //   }
  //   const passwordIsValid = compareSync(password, user.password);
  //   if (!passwordIsValid) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
  //   }
  //
  //   // return this.buildUserResponseWithToken(user);
  //   return user.id;
  // }

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
