import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '@/modules/user/interfaces/user-response.type';
import { LoginUserResponse } from '@/modules/user/interfaces/user-login-response.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateUserDto): Promise<number> {
    return this.userService.create(dto);
  }

  @Get()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCurrentUser(@User() user: UserEntity): Promise<UserResponseDto | null> {
    return this.userService.findOneById(user.id);
  }

  // @Put()
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Update the current user' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponse })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async update(@User('id') id: number, @Body() dto: UpdateUserDto): Promise<UserResponse> {
  //   return this.userService.update(id, dto);
  // }
  //
  // @Post('login')
  // @ApiOperation({ summary: 'login user' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserResponse })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // async login(@Body() dto: LoginUserDto): Promise<LoginUserResponse | null> {
  //   return this.userService.login(dto);
  // }
}
