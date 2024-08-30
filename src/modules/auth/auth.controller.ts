import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { AuthService } from '@/modules/auth/auth.service';
import { EMAIL_MSG, SIGNUP_MSG } from '@/modules/auth/auth.constants';
import { ConfirmDto, EmailDto, SignInDto, SignInRespDto, SignUpDto } from '@/modules/auth/auth.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'The new user has been created', schema: { example: SIGNUP_MSG } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async signUp(@Body() payload: SignUpDto): Promise<string> {
    return this.authService.signUp(payload);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm the registration' })
  @ApiBody({ type: ConfirmDto })
  @ApiOkResponse({ description: 'The registration has been confirmed', type: SignInRespDto })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async confirm(@Body() payload: ConfirmDto): Promise<SignInRespDto> {
    return this.authService.confirm(payload.email, payload.code);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send a email with a confirmation code' })
  @ApiBody({ type: EmailDto })
  @ApiOkResponse({ description: 'The email has been sent', schema: { example: EMAIL_MSG } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async sendEmail(@Body() payload: EmailDto): Promise<string> {
    return this.authService.sendEmail(payload.email, payload.type);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiOkResponse({ description: 'The user is logged in', type: SignInRespDto })
  @ApiUnauthorizedResponse({ description: 'Unverified email', schema: { example: CCBK_ERR_TO_HTTP.CCBK10 } })
  @ApiUnauthorizedResponse({ description: 'Authorisation failed', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  async signIn(@Body() payload: SignInDto): Promise<SignInRespDto> {
    return this.authService.signIn(payload.email, payload.password);
  }

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
