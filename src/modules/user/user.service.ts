import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponseInterface } from './types/user-response.type';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
              private readonly configService: ConfigService
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, dto);
    return this.userRepository.save(newUser);
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

  async update(userId: number, dto: UpdateUserDto): Promise<string> {
    return `the user with id = ${userId} has been updated!`;
  }

  async remove(userId: number): Promise<string> {
    return `the user with id = ${userId} has been deleted!`;
  }

  async buildUserResponse(user: UserEntity): Promise<UserResponseInterface> {
    const token = await this.generateJwt(user);
    return { ...user, token };
  }

  async generateJwt(user: UserEntity): Promise<string> {
    const secret = this.configService.get('JWT_SECRET');
    console.log(`\nsecret = ${secret}`);
    return sign({
      id: user.id,
      login: user.login,
      email: user.email
    }, secret);
  }
}
