import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AuthService {
  async signUp(dto: CreateUserDto): Promise<string> {
    return 'new account has been created';
  }

  async signIn(dto: AuthDto): Promise<string> {
    return 'authentication was successful';
  }

  async restorePassword(dto: UpdateUserDto): Promise<string> {
    return 'your password has been successfully changed';
  }
}
