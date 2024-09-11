import { IsEmail, IsIn, IsJWT, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserDto } from '@/modules/user/user.dto';
import { EmailType } from '@/modules/auth/auth.interfaces';
import { INVALID_PASSWORD_ERR_MSG, PASSWORD_REGEX } from '@/modules/auth/auth.constants';

export class SignUpDto extends UserDto {
  @ApiProperty({ description: 'application domain', nullable: true })
  @IsOptional()
  readonly domain?: string;

  @ApiProperty({ description: 'user password', nullable: false, example: 'Password88' })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, { message: INVALID_PASSWORD_ERR_MSG })
  readonly password: string;
}

export abstract class EmailDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  @Length(5, 255)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;
}

export class ConfirmDto extends EmailDto {
  @ApiProperty({ description: 'The confirmation code' })
  @IsString()
  @Length(4)
  readonly code: string;
}

export class SignInDto {
  @ApiProperty({ description: 'email', nullable: false })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'application domain', nullable: true })
  @IsOptional()
  readonly domain?: string;
}

export class TokensDto {
  @ApiProperty({ description: 'access token', nullable: false })
  @IsJWT()
  readonly accessToken: string;

  @ApiProperty({ description: 'refresh token', nullable: false })
  @IsJWT()
  readonly refreshToken: string;
}

export abstract class SendEmailDto extends EmailDto {
  @ApiProperty({ description: 'email type', nullable: false, enum: EmailType })
  @IsIn(Object.values(EmailType))
  readonly type: EmailType;
}

export abstract class ConfirmResetDto extends ConfirmDto {
  @ApiProperty({ description: 'new password', nullable: false })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, { message: INVALID_PASSWORD_ERR_MSG })
  readonly password: string;
}

export abstract class UpdatePasswordDto extends TokensDto {
  @ApiProperty({ description: 'current password', nullable: false })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, { message: INVALID_PASSWORD_ERR_MSG })
  readonly currentPassword: string;

  @ApiProperty({ description: 'new password', nullable: false })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, { message: INVALID_PASSWORD_ERR_MSG })
  readonly newPassword: string;
}
