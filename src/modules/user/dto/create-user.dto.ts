import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'email', nullable: false })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'login', nullable: true })
  @IsNotEmpty()
  readonly nickname?: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  readonly avatar?: string;
}
