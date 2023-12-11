import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@Controller('dictionaries')
export class DictionariesController {
  @Post('create')
  async create(@Body() dto: CreateDictionaryDto): Promise<string> {
    return 'A new dictionary has been created!';
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<string> {
    return `the dictionary with id = ${id}`;
  }

  @Get()
  async getAllDictionaries(): Promise<string> {
    return 'all available dictionaries';
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return `the dictionary with id = ${id} has been deleted!`;
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: CreateDictionaryDto): Promise<string> {
    return `the dictionary with id = ${id} has been updated!`;
  }
}
