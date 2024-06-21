import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import config from '@/config/config.service';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { UserResponseDto } from '@/modules/user/interfaces/user-response.type';
import { LoginUserResponse } from '@/modules/user/interfaces/user-login-response.type';
import { UserInterface } from '@/modules/user/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { EMAIL_ALREADY_IN_USE, INVALID_CREDENTIALS, LOGIN_ALREADY_IN_USE } from './user.constants';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async create(userData: UserInterface): Promise<number> {
    const { email } = userData;
    const oldUser = await this.userRepo.findOne(email);
    if (oldUser?.email === email) throw new HttpException(EMAIL_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
    const newUser = new UserEntity();
    Object.assign(newUser, userData);
    const user = await this.userRepo.create(newUser);
    // return this.buildUserResponseWithToken(user);
    return user.id;
  }

  // async findOne(userData: UserEntity): Promise<UserEntity | null> {
  //   const user = await this.userRepo.find({
  //     where: [
  //       { id: userData.id },
  //       { login: userData.login },
  //       { email: userData.email },
  //     ],
  //   });
  //   return user[0];
  // }

  async findOneById(id: number): Promise<UserResponseDto | null> {
    return this.userRepo.findOneById(id);
  }

  // async login(dto: LoginUserDto): Promise<LoginUserResponse> {
  //   const user = (await this.userRepo.find({
  //     select: {
  //       id: true,
  //       login: true,
  //       email: true,
  //       password: true,
  //       avatar: true,
  //     },
  //     where: [{ login: dto.login }],
  //   }))[0];
  //   if (!user) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNPROCESSABLE_ENTITY);
  //   const passwordIsValid = compareSync(dto.password, user.password);
  //   if (!passwordIsValid) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNPROCESSABLE_ENTITY);
  //   return this.buildUserResponseWithToken(user);
  // }
  //
  // async update(id: number, dto: UpdateUserDto): Promise<UserResponse> {
  //   const oldUser = await this.findOne(dto as UserEntity);
  //   if (oldUser?.login === dto.login && oldUser?.id !== id) {
  //     throw new HttpException(LOGIN_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
  //   }
  //   if (oldUser?.email === dto.email && oldUser?.id !== id) {
  //     throw new HttpException(EMAIL_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
  //   }
  //
  //   const user = new UserEntity();
  //   Object.assign(user, dto);
  //   const updateResult = await this.userRepo.createQueryBuilder().update(user)
  //     .set(user)
  //     .where('id = :id', { id })
  //     .returning('id, login, email, avatar')
  //     .execute();
  //   return updateResult.raw[0];
  // }
  //
  async buildUserResponseWithToken(user: UserEntity): Promise<LoginUserResponse> {
    const token = await this.generateJwt(user);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }

  async generateJwt(user: UserEntity): Promise<string> {
    const secret = config.JWT_SECRET;
    return sign(
      {
        id: user.id,
        login: user.nickname,
        email: user.email
      },
      secret
    );
  }
}
