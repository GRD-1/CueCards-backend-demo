import {
  Body,
  Controller, Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<string> {
    return 'A new user has been created!';
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('userId', new ParseIntPipe()) userId: number): Promise<string> {
    return `the user with id = ${userId}`;
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UsersEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('userId') userId: number, @Body() dto: UpdateUserDto): Promise<string> {
    return `the user with id = ${userId} has been updated!`;
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('userId') userId: number): Promise<string> {
    return `the user with id = ${userId} has been deleted!`;
  }
}
