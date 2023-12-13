import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'login', nullable: true })
  @IsString()
    login: string;

  @ApiProperty({ description: 'email', nullable: true })
  @IsString()
    email: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  @IsString()
    avatar?: string;

  @ApiProperty({ description: 'password', nullable: true })
  @IsString()
    password?: string;
}
