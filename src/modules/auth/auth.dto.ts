import { IsEmail, IsJWT, IsString, Length, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from '@/modules/user/user.constants';

export class PasswordsDto {
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public password: string;
}

export class SignUpDto extends PasswordsDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;
}

export abstract class SignInDto extends PasswordsDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;
}

export abstract class EmailDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;
}

export abstract class ResetPasswordDto {
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public oldPassword: string;

  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public newPassword: string;

  @IsString()
  @IsJWT()
  public resetToken: string;
}

export abstract class ChangePasswordDto extends PasswordsDto {
  @IsString()
  @MinLength(1)
  public newPassword: string;
}
