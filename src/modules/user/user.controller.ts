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
import { UserResponseInterface } from './types/user-response.type';
import { LoginUserDto } from './dto/login-user.dto';

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
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the specific user' })
  @ApiParam({ name: 'id', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id } as UserEntity);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the specific user' })
  @ApiParam({ name: 'id', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<string> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the specific user' })
  @ApiParam({ name: 'id', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('id') id: number): Promise<string> {
    return this.userService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async login(@Body() dto: LoginUserDto): Promise<UserResponseInterface | null> {
    return this.userService.login(dto);
  }
}
