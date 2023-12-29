import { ApiProperty } from '@nestjs/swagger';
import { UserType } from './user.type';

export class LoginUserResponse implements UserType {
  @ApiProperty({ description: 'user id', nullable: false })
    id: number;

  @ApiProperty({ description: 'login', nullable: false })
    login: string;

  @ApiProperty({ description: 'email', nullable: false })
    email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
    avatar: string;

  @ApiProperty({ type: 'text', description: 'bearer token', nullable: true })
    token: string;
}
