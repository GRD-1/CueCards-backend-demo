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
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.create(dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get the specific user' })
  @ApiParam({ name: 'userId', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('userId', new ParseIntPipe()) userId: number): Promise<string> {
    return this.userService.findOne(userId);
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
