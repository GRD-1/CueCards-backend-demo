import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
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
import { UpdateUserDto, UserRespDto } from '@/modules/user/user.dto';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { UserId } from '@/decorators/user-id.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user data' })
  @ApiOkResponse({ description: 'The user has been found', type: UserRespDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@UserId() userId: string): Promise<UserRespDto> {
    return this.userService.findOneById(userId);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update a user data' })
  @ApiBody({ type: UpdateUserDto, examples: { example1: { value: { nickname: 'myNewNickName' } } } })
  @ApiOkResponse({ description: 'The user has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid user data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async update(@UserId() userId: string, @Body() payload: UpdateUserDto): Promise<string> {
    return this.userService.update(userId, payload);
  }

  @Delete('update-password')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'The user has been deleted' })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async delete(@UserId() userId: string): Promise<string> {
    return this.userService.delete(userId);
  }
}
