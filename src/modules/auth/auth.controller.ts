import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersEntity } from '../users/entities/users.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('sign-up')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async signUp(@Body() dto: CreateUserDto): Promise<string> {
    return 'new account has been created';
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'sign-in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async signIn(@Body() dto: AuthDto): Promise<string> {
    return 'authentication was successful';
  }

  @Patch('restore-password')
  @ApiOperation({ summary: 'restore the password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async restorePassword(@Body() dto: UpdateUserDto): Promise<string> {
    return 'your password has been successfully changed';
  }
}
