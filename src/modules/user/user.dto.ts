import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

export class UserDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  @Length(5, 150)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ description: 'user nickname', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  readonly nickname: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true })
  @IsString()
  @IsOptional()
  readonly avatar: string | null;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  @Length(6, 20)
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

  @ApiProperty({ description: 'is the registration confirmed', nullable: false })
  readonly confirmed: boolean;
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

export class UpdatePasswordDto {
  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'new password', nullable: false })
  @IsNotEmpty()
  readonly newPassword: string;
}
