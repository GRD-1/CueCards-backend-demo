import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserResponseInterface } from './types/user-response.type';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseInterface> {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the specific user' })
  @ApiParam({ name: 'id', required: true, description: 'user identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<UserResponseInterface> {
    return this.userService.update(id, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async login(@Body() dto: LoginUserDto): Promise<UserResponseInterface | null> {
    return this.userService.login(dto);
  }
}
