import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class UserDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'user nickname', nullable: false })
  @IsNotEmpty()
  readonly nickname: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  @IsString()
  @IsOptional()
  readonly avatar: string | null;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;
}

export class UserRespDto {
  @ApiProperty({ description: 'id', nullable: false })
  readonly id: number;

  @ApiProperty({ description: 'email', nullable: false })
  readonly email: string;

  @ApiProperty({ description: 'nickname', nullable: false })
  readonly nickname: string | null;

  @ApiProperty({ description: 'avatar', nullable: true })
  readonly avatar: string | null;
}

export class LoginUserDto {
  @ApiProperty({ description: 'email', nullable: false })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
