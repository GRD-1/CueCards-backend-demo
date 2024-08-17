import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Patch } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UpdateUserDto } from '@/modules/user/user.dto';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { UserId } from '@/decorators/user-id.decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiBody({ type: UserDto })
  // @ApiCreatedResponse({ description: 'The new user has been created. The id:', schema: { example: 123 } })
  // @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  // @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  // async create(@Body() payload: UserDto): Promise<number> {
  //   return this.userService.create(payload);
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
