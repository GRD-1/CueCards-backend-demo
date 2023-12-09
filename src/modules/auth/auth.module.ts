import { Module } from '@nestjs/common';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [SignInModule, SignUpModule, ResetPasswordModule]
})
export class AuthModule {}
