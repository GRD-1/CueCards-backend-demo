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
import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { AuthService } from '@/modules/auth/auth.service';
import { DELETE_USER_MSG, EMAIL_MSG, LOGOUT_MSG, RESET_PASS_EMAIL_MSG } from '@/constants/messages.constants';
import {
  ConfirmDto,
  ConfirmResetDto,
  EmailDto,
  SendEmailDto,
  SignInDto,
  SignUpDto,
  TokensDto,
  UpdatePasswordDto,
} from '@/modules/auth/auth.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { TokenPayload } from '@/decorators/token-payload.decorator';
import { CustomJwtPayload } from '@/modules/jwt/jwt.interfaces';
import { UserId } from '@/decorators/user-id.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User created', schema: { example: '530350e2-cc3f-40fb-b82e-7e4241a3c03b' } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async signUp(@Body() payload: SignUpDto): Promise<string> {
    return this.authService.signUp(payload);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm the registration' })
  @ApiBody({ type: ConfirmDto })
  @ApiOkResponse({ description: 'The registration has been confirmed', type: TokensDto })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async confirmEmail(@Body() payload: ConfirmDto): Promise<TokensDto> {
    return this.authService.confirmEmail(payload.email, payload.code);
  }

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a email with a confirmation code' })
  @ApiBody({ type: SendEmailDto })
  @ApiOkResponse({ description: 'The email has been sent', schema: { example: EMAIL_MSG } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async sendEmail(@Body() payload: SendEmailDto): Promise<string> {
    return this.authService.sendEmail(payload.email, payload.type);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'The user is logged in', type: TokensDto })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  @ApiUnauthorizedResponse({ description: 'Authorisation failed', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async signIn(@Body() payload: SignInDto): Promise<TokensDto> {
    return this.authService.signIn(payload.email, payload.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out of the system' })
  @ApiBody({ type: TokensDto })
  @ApiOkResponse({ description: 'The user has been logged out', schema: { example: LOGOUT_MSG } })
  @ApiUnauthorizedResponse({ description: 'Invalid token', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async logout(@Body() payload: TokensDto): Promise<string> {
    return this.authService.logout(payload.accessToken, payload.refreshToken);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset a user password' })
  @ApiBody({ type: EmailDto })
  @ApiOkResponse({ description: 'The reset code has been sent', schema: { example: RESET_PASS_EMAIL_MSG } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async resetPassword(@Body() payload: EmailDto): Promise<string> {
    return this.authService.resetPassword(payload.email);
  }

  @Post('confirm-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a password reset' })
  @ApiBody({ type: ConfirmResetDto })
  @ApiOkResponse({ description: 'The password has been reset', type: TokensDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiUnauthorizedResponse({ description: 'Invalid reset code', schema: { example: CCBK_ERR_TO_HTTP.CCBK02 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async confirmReset(@Body() payload: ConfirmResetDto): Promise<TokensDto> {
    return this.authService.confirmReset(payload.email, payload.code, payload.password);
  }

  @Patch('update-password')
  @ApiOperation({ summary: 'Update a user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: 'The user password has been updated', type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Invalid password', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async updatePassword(@Body() payload: UpdatePasswordDto): Promise<TokensDto> {
    return this.authService.updatePassword(payload);
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a new couple of tokens' })
  @ApiOkResponse({ description: 'The tokens have been refreshed', type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Invalid token', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async refreshTokens(@TokenPayload() tokenPayload: CustomJwtPayload): Promise<TokensDto> {
    return this.authService.refreshTokens(tokenPayload);
  }

  @Delete('delete-user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'The user has been deleted', schema: { example: DELETE_USER_MSG } })
  @ApiUnauthorizedResponse({ description: 'Authorization is required', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async delete(@UserId() userId: string): Promise<string> {
    return this.authService.delete(userId);
  }
}
