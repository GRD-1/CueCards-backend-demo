import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post, Put, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserResponse } from './types/user-response.type';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { LoginUserResponse } from './types/user-login-response.type';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UserResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<LoginUserResponse> {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCurrentUser(@User() user: UserEntity): Promise<UserResponse | null> {
    return this.userService.findById(user.id);
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@User('id') id: number, @Body() dto: UpdateUserDto): Promise<UserResponse> {
    return this.userService.update(id, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async login(@Body() dto: LoginUserDto): Promise<LoginUserResponse | null> {
    return this.userService.login(dto);
  }
}
