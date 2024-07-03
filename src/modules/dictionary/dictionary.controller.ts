import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/modules/user/decorators/user.decorator';
import { UserEntity } from '@/modules/user/entities/user.entity';
import {
  CreateDictionaryDto,
  DictionaryRespDto,
  GetManyDictionariesDto,
  GetManyDictRespDto,
  UpdateDictionaryDto,
} from '@/modules/dictionary/dictionary.dto';
import { BadRequestExample } from '@/filters/errors/error.examples';
import { plainToInstance } from 'class-transformer';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { DictionaryService } from './dictionary.service';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiOkResponse({ description: 'The new dictionary has been created', type: Number })
  @ApiResponse({ status: 422, description: 'invalid dictionary data', schema: { example: CCBK_ERR_TO_HTTP.CCBK04 } })
  async create(@Body() payload: CreateDictionaryDto, @User() user: UserEntity): Promise<number> {
    return this.dictionaryService.create(payload, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get dictionaries according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'title', required: false, type: String, description: 'dictionary title' })
  @ApiOkResponse({ description: 'Successful request', type: GetManyDictRespDto })
  @ApiResponse({ status: 400, description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findMany(@Query() query: GetManyDictionariesDto, @User() user: UserEntity): Promise<GetManyDictRespDto> {
    const authorId = query.byUser ? user.id : undefined;
    const data = await this.dictionaryService.findMany({ ...query, authorId });

    return plainToInstance(GetManyDictRespDto, data, { enableImplicitConversion: true });
  }

  @Get(':dictionaryId')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiResponse({ status: 200, description: 'The dictionary has been found', type: DictionaryRespDto })
  @ApiResponse({ status: 204, description: 'The dictionary was not found', schema: { example: {} } })
  @ApiResponse({ status: 400, description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findOneById(@Param('dictionaryId', ParseIntPipe) id: number): Promise<DictionaryRespDto | null> {
    const data = this.dictionaryService.findOneById(id);

    return plainToInstance(DictionaryRespDto, data, { enableImplicitConversion: true });
  }

  @Patch(':dictionaryId')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiBody({ type: UpdateDictionaryDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'The dictionary has been updated', type: Number })
  @ApiResponse({ status: 422, description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async update(@Param('dictionaryId', ParseIntPipe) id: number, @Body() payload: UpdateDictionaryDto): Promise<number> {
    return this.dictionaryService.updateOneById(id, payload);
  }

  @Delete(':dictionaryId')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'The dictionary has been deleted', type: Number })
  @ApiResponse({ status: 422, description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async delete(@Param('dictionaryId', ParseIntPipe) id: number): Promise<number> {
    return this.dictionaryService.delete(id);
  }
}
