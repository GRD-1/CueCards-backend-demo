import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
    login: string;

  @IsString()
    email: string;

  @IsString()
    avatar?: string;

  @IsString()
    passwordHash?: string;
}
