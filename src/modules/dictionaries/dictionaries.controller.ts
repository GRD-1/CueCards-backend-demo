import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { DictionaryEntity } from './entities/dictionaries.entity';

@ApiTags('library/dictionaries')
@Controller('library/dictionaries')
export class DictionariesController {
  @Post('create')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: DictionaryEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateDictionaryDto): Promise<string> {
    return 'A new dictionary has been created!';
  }

  @Get()
  @ApiOperation({ summary: 'Get all available dictionaries' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return 'these is all available dictionaries';
  }

  @Get(':dictionaryId')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('dictionaryId', new ParseIntPipe()) dictionaryId: number): Promise<string> {
    return `the dictionary with id = ${dictionaryId}`;
  }

  @Patch(':dictionaryId')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DictionaryEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('dictionaryId') dictionaryId: string, @Body() dto: CreateDictionaryDto): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been updated!`;
  }

  @Delete(':dictionaryId')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('dictionaryId') dictionaryId: string): Promise<string> {
    return `the dictionary with id = ${dictionaryId} has been deleted!`;
  }
}
