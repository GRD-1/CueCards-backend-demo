import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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
import { ConfirmDto, EmailDto, SendEmailDto, SignInDto, SignUpDto, TokensDto } from '@/modules/auth/auth.dto';

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
  @ApiOkResponse({ description: 'The registration has been confirmed', type: TokensDto })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async confirm(@Body() payload: ConfirmDto): Promise<TokensDto> {
    return this.authService.confirm(payload.email, payload.code);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send a email with a confirmation code' })
  @ApiBody({ type: SendEmailDto })
  @ApiOkResponse({ description: 'The email has been sent', schema: { example: EMAIL_MSG } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async sendEmail(@Body() payload: SendEmailDto): Promise<string> {
    return this.authService.sendEmail(payload.email, payload.type);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'The user is logged in', type: TokensDto })
  @ApiForbiddenResponse({ description: '... Unconfirmed email', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  @ApiUnauthorizedResponse({ description: 'Authorisation failed', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async signIn(@Body() payload: SignInDto): Promise<TokensDto> {
    return this.authService.signIn(payload.email, payload.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out of the system' })
  @ApiBody({ type: TokensDto })
  @ApiOkResponse({ description: 'The user has been logged out' })
  @ApiUnauthorizedResponse({ description: '... Token expired', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  @ApiBadRequestResponse({ description: 'Bad request. Invalid token', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async logout(@Body() payload: TokensDto): Promise<string> {
    return this.authService.logout(payload.accessToken, payload.refreshToken);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset a user password' })
  @ApiBody({ type: EmailDto })
  @ApiOkResponse({ description: 'The password has been reset' })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async resetPassword(@Body() payload: EmailDto): Promise<string> {
    return this.authService.resetPassword(payload.email);
  }

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
