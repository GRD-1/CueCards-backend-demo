import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  @Post('sign-up')
  async signUp(@Body() dto: UserDto): Promise<string> {
    return 'new account were created';
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: AuthDto): Promise<string> {
    return 'authentication was successful';
  }

  @Patch('restore-password')
  async restorePassword(@Body() dto: AuthDto): Promise<string> {
    return 'your password was successfully changed';
  }
}
