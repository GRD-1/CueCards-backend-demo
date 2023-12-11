import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  @Get(':id')
  async get(@Param('id') id: number): Promise<string> {
    return 'the specific user data';
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: UserDto): Promise<string> {
    return `the specific user with id = ${id} has been updated!`;
  }
}
