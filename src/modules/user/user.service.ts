import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  async create(dto: CreateUserDto): Promise<string> {
    return 'A new user has been created!';
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
