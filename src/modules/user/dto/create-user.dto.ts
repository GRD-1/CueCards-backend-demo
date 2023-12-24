import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'login', nullable: true })
  @IsString()
  readonly login: string;

  @ApiProperty({ description: 'email', nullable: true })
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  @IsString()
  readonly avatar?: string;

  @ApiProperty({ description: 'password', nullable: true })
  @IsString()
  readonly password?: string;
}
