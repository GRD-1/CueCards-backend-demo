import { ApiProperty } from '@nestjs/swagger';
import { LoginUserResponse } from './user-login-response.type';

export class UserResponse implements Omit<LoginUserResponse, 'token' | 'refreshToken'> {
  @ApiProperty({ description: 'user id', nullable: false })
    id: number;

  @ApiProperty({ description: 'login', nullable: false })
    login: string;

  @ApiProperty({ description: 'email', nullable: false })
    email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
    avatar: string;
}
