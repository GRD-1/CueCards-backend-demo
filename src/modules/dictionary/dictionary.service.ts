import { Body, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@Injectable()
export class DictionaryService {
  async create(dto: CreateDictionaryDto): Promise<string> {
    return 'A new dictionary has been created!';
  }

  async findAll(): Promise<string> {
    return 'these is all available dictionary';
  }

  async findOne(dictionaryId: number): Promise<string> {
    return `the dictionary with id = ${dictionaryId}`;
  }

  async update(dictionaryId: string, @Body() dto: CreateDictionaryDto): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been updated!`;
  }

  async remove(dictionaryId: string): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been deleted!`;
  }
}
