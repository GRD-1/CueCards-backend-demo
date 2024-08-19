import { IsEmail, IsJWT, IsString, Length, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from '@/modules/user/user.constants';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// export class SignUpDto extends PasswordsDto {
//   @IsString()
//   @IsEmail()
//   @Length(5, 255)
//   readonly email!: string;
// }
//
// export abstract class SignInDto extends PasswordsDto {
//   @IsString()
//   @IsEmail()
//   @Length(5, 255)
//   readonly email!: string;
// }

export abstract class EmailDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  @Length(5, 255)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;
}

export class PasswordsDto {
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message: 'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  readonly oldPassword: string;

  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message: 'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  readonly newPassword: string;
}

export abstract class ResetPasswordDto extends PasswordsDto {
  @IsString()
  @IsJWT()
  readonly resetToken: string;
}

// export abstract class ChangePasswordDto {
//   @IsString()
//   @Length(8, 35)
//   @Matches(PASSWORD_REGEX, {
//     message: 'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
//   })
//   readonly password: string;
//
//   @IsString()
//   @Length(8, 35)
//   @Matches(PASSWORD_REGEX, {
//     message: 'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
//   })
//   readonly newPassword: string;
// }
