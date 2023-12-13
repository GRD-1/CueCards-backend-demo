import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { DictionariesEntity } from './entities/dictionaries.entity';
import { CardsEntity } from '../cards/entities/cards.entity';
import { CreateCardDto } from '../cards/dto/create-card.dto';

@ApiTags('library/dictionaries')
@Controller('library/dictionaries')
export class DictionariesController {
  @Post('create')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiParam({ name: 'UserId', required: true, description: 'User identifier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: DictionariesEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateDictionaryDto): Promise<string> {
    return 'A new dictionary has been created!';
  }

  @Get()
  @ApiOperation({ summary: 'Get all available dictionaries' })
  @ApiQuery({ name: 'userId', required: false, description: 'User identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionariesEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return 'these is all available dictionaries';
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async get(@Param('dictionaryId') dictionaryId: string): Promise<string> {
    return `the dictionary with id = ${dictionaryId}`;
  }

  @Delete(':id')
  async delete(@Param('dictionaryId') dictionaryId: string): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been deleted!`;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async patch(@Param('dictionaryId') dictionaryId: string, @Body() dto: CreateDictionaryDto): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been updated!`;
  }
}
