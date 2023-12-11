import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  @Post('create')
  async create(@Body() dto: CreateCardDto): Promise<string> {
    return 'A new card has been created!';
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<string> {
    return `the card with id = ${id}`;
  }

  @Get()
  async getAllCards(): Promise<string> {
    return 'all available cards';
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return `the card with id = ${id} has been deleted!`;
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: CreateCardDto): Promise<string> {
    return `the card with id = ${id} has been updated!`;
  }
}
