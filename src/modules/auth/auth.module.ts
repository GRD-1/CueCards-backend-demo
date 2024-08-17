import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { MailerModule } from '@/modules/mailer/mailer.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, JwtModule, MailerModule],
  providers: [AuthService],
})
export class AuthModule {}
