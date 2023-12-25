import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get, HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EMAIL_ALREADY_IN_USE, LOGIN_ALREADY_IN_USE } from './user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserResponseInterface } from './types/user-response.type';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseInterface> {
    const oldUser = await this.userService.findOne(dto as UserEntity);
    if (oldUser?.login === dto.login) throw new HttpException(LOGIN_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
    if (oldUser?.email === dto.email) throw new HttpException(EMAIL_ALREADY_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
    const newUser = await this.userService.create(dto);
    return this.userService.buildUserResponse(newUser);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('userId', new ParseIntPipe()) userId: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id: userId } as UserEntity);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('userId') userId: number, @Body() dto: UpdateUserDto): Promise<string> {
    return this.userService.update(userId, dto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('userId') userId: number): Promise<string> {
    return this.userService.remove(userId);
  }
}
