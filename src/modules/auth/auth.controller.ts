import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { AuthService } from '@/modules/auth/auth.service';
import { SIGNUP_MSG } from '@/modules/auth/auth.constants';
import { UserDto } from '@/modules/user/user.dto';

import * as nodemailer from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({ description: 'The new user has been created', schema: { example: SIGNUP_MSG } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async signUp(@Body() payload: UserDto): Promise<string> {
    return this.authService.signUp(payload);
  }

  // constructor(
  //   private readonly authService: AuthService,
  //   private readonly mailService: MailService,
  // ) {}

  // @Post('test-mailer')
  // async testMailer(): Promise<string> {
  //   try {
  //     await this.mailService.sendConfirmationEmail('d.grebelny@gmail.com', 'Barabulka', 'test-token');
  //
  //     return 'Email sent successfully';
  //   } catch (error) {
  //     console.error(error);
  //
  //     return 'Failed to send email';
  //   }
  // }
  //
  // @Post('test')
  // async test(): Promise<string> {
  //   const configService = new ConfigService();
  //
  //   const transporter = nodemailer.createTransport(sesTransport({
  //     accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
  //     secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
  //     region: configService.get('AWS_SES_REGION')!,
  //   }));
  //
  //   transporter.sendMail({
  //     from: 'cuecards2000@gmail.com',
  //     to: 'd.grebelny@gmail.com',
  //     subject: 'Test Email',
  //     text: 'Hello, this is a new test email from CueCards.',
  //   }, (err, info) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log(info);
  //     }
  //   });
  //
  //   return 'test completed';
  // }

  // @Post('login')
  // @ApiOperation({ summary: 'login user' })
  // @ApiOkResponse({ description: 'The user is logged in. The id:', schema: { example: 123 } })
  // @ApiUnauthorizedResponse({ description: 'Authorisation failed', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  // async login(@Body() payload: LoginUserDto): Promise<number> {
  //   return this.userService.login(payload.email, payload.password);
  // }
  //
  // @Get()
  // // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Get the current user data' })
  // @ApiOkResponse({ description: 'The user has been found', type: UserRespDto })
  // @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  // async getCurrentUser(@UserId() userId: number): Promise<UserRespDto> {
  //   return this.userService.findOneById(userId);
  // }

  // @Patch('update')
  // // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Update a user data' })
  // @ApiBody({ type: UpdateUserDto, examples: { example1: { value: { nickname: 'myNewNickName' } } } })
  // @ApiOkResponse({ description: 'The user has been updated. The id:', schema: { example: 123 } })
  // @ApiBadRequestResponse({ description: 'Invalid user data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  // @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  // @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  // async update(@UserId() userId: number, @Body() payload: UpdateUserDto): Promise<number> {
  //   return this.userService.update(userId, payload);
  // }

  // @Patch('update-password')
  // // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Update a user password' })
  // @ApiBody({ type: UpdatePasswordDto, examples: { 1: { value: { password: 'oldPass', newPassword: 'newPass' } } } })
  // @ApiOkResponse({ description: 'The user password has been updated' })
  // @ApiBadRequestResponse({ description: 'Invalid password', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  // async updatePassword(@UserId() userId: number, @Body() payload: UpdatePasswordDto): Promise<void> {
  //   return this.userService.updatePassword(userId, payload.password, payload.newPassword);
  // }
}
