import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponseInterface } from './types/user-response.type';
import { EMAIL_ALREADY_IN_USE, INVALID_CREDENTIALS, LOGIN_ALREADY_IN_USE } from './user.constants';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
              private readonly configService: ConfigService
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseInterface> {
    const oldUser = await this.findOne(dto as UserEntity);
    if (oldUser?.login === dto.login) throw new HttpException(LOGIN_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
    if (oldUser?.email === dto.email) throw new HttpException(EMAIL_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
    const newUser = new UserEntity();
    Object.assign(newUser, dto);
    const user = await this.userRepository.save(newUser);
    return this.buildUserResponse(user);
  }

  async findOne(userData: UserEntity): Promise<UserEntity | null> {
    const user = await this.userRepository.find({
      where: [
        { id: userData.id },
        { login: userData.login },
        { email: userData.email }
      ]
    });
    return user[0];
  }

  async login(dto: LoginUserDto): Promise<UserResponseInterface> {
    const user = (await this.userRepository.find({
      select: {
        id: true,
        login: true,
        email: true,
        password: true,
        avatar: true
      },
      where: [{ login: dto.login }]
    }))[0];
    if (!user) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNPROCESSABLE_ENTITY);
    const passwordIsValid = compareSync(dto.password, user.password);
    if (!passwordIsValid) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNPROCESSABLE_ENTITY);
    return this.buildUserResponse(user);
  }

  async update(userId: number, dto: UpdateUserDto): Promise<string> {
    return `the user with id = ${userId} has been updated!`;
  }

  async remove(userId: number): Promise<string> {
    return `the user with id = ${userId} has been deleted!`;
  }

  async buildUserResponse(user: UserEntity): Promise<UserResponseInterface> {
    const token = await this.generateJwt(user);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }

  async generateJwt(user: UserEntity): Promise<string> {
    const secret = this.configService.get('JWT_SECRET');
    return sign({
      id: user.id,
      login: user.login,
      email: user.email
    }, secret);
  }
}
