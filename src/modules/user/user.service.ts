import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async create(dto: CreateUserDto): Promise<CreateUserDto> {
    const newUser = new UserEntity();
    Object.assign(newUser, dto);
    return this.userRepository.save(newUser);
  }

  async findOne(userId: number): Promise<string> {
    return `the user with id = ${userId}`;
  }

  async update(userId: number, dto: UpdateUserDto): Promise<string> {
    return `the user with id = ${userId} has been updated!`;
  }

  async remove(userId: number): Promise<string> {
    return `the user with id = ${userId} has been deleted!`;
  }
}
