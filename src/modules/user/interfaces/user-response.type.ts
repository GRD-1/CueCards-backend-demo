import { ApiProperty } from '@nestjs/swagger';
import { LoginUserResponse } from './user-login-response.type';

export class UserResponseDto {
  @ApiProperty({ description: 'user id', nullable: false })
  id: number;

  @ApiProperty({ description: 'login', nullable: true })
  nickname: string | null;

  @ApiProperty({ description: 'email', nullable: false })
  email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
  avatar: string | null;
}
