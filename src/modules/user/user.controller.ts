import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
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
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { UserId } from '@/decorators/user-id.decorator';
import { UpdateUserDto, UserRespDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Get the current user data' })
  // @ApiOkResponse({ description: 'The user has been found', type: UserRespDto })
  // @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  // async getCurrentUser(@UserId() userId: number): Promise<UserRespDto> {
  //   return this.userService.findOneById(userId);
  // }

  @Patch('update')
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a user data' })
  @ApiBody({ type: UpdateUserDto, examples: { example1: { value: { nickname: 'myNewNickName' } } } })
  @ApiOkResponse({ description: 'The user has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid user data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async update(@UserId() userId: number, @Body() payload: UpdateUserDto): Promise<number> {
    return this.userService.update(userId, payload);
  }

  @Delete('update-password')
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a user password' })
  @ApiOkResponse({ description: 'The user password has been updated' })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async updatePassword(@UserId() userId: number): Promise<number> {
    return this.userService.delete(userId);
  }
}
