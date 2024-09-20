import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'user login', nullable: false })
  readonly login: string;

  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  readonly avatar: string;

  @ApiProperty({ description: 'password', nullable: false })
  readonly password: string;
}
