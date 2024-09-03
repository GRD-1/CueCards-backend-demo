import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { PASSWORD_REGEX } from '@/modules/user/user.constants';

export class UserDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  @Length(5, 255)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ description: 'user nickname', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  readonly nickname: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true, example: '~/path/to/avatar.png' })
  @IsString()
  @IsOptional()
  readonly avatar: string | null;

  @ApiProperty({ description: 'user password', nullable: false, example: 'Password88' })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message: 'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  readonly password: string;
}

export class UserRespDto {
  @ApiProperty({ description: 'id', nullable: false })
  readonly id: string;

  @ApiProperty({ description: 'email', nullable: false })
  readonly email: string;

  @ApiProperty({ description: 'nickname', nullable: false })
  readonly nickname: string | null;

  @ApiProperty({ description: 'avatar', nullable: true })
  readonly avatar: string | null;

  @ApiProperty({ description: 'is the registration confirmed', nullable: false })
  readonly confirmed: boolean;
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
