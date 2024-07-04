import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
import { plainToInstance } from 'class-transformer';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { DictionaryService } from './dictionary.service';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiCreatedResponse({ description: 'The new dictionary has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async create(@Body() payload: CreateDictionaryDto, @User() user: UserEntity): Promise<number> {
    return this.dictionaryService.create(payload, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get dictionaries according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'dictionary title' })
  @ApiOkResponse({ description: 'Successful request', type: GetManyDictRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findMany(@Query() query: GetManyDictionariesDto, @User() user: UserEntity): Promise<GetManyDictRespDto> {
    const authorId = query.byUser ? user.id : undefined;
    const data = await this.dictionaryService.findMany({ ...query, authorId });

    return plainToInstance(GetManyDictRespDto, data, { enableImplicitConversion: true });
  }

  @Get(':dictionaryId')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'The dictionary has been found', type: DictionaryRespDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@Param('dictionaryId', ParseIntPipe) id: number): Promise<DictionaryRespDto> {
    const data = this.dictionaryService.findOneById(id);

    return plainToInstance(DictionaryRespDto, data, { enableImplicitConversion: true });
  }

  @Patch(':dictionaryId')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiBody({ type: UpdateDictionaryDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'The dictionary has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid dictionary data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async update(@Param('dictionaryId', ParseIntPipe) id: number, @Body() payload: UpdateDictionaryDto): Promise<number> {
    return this.dictionaryService.updateOneById(id, payload);
  }

  @Delete(':dictionaryId')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'The dictionary has been deleted. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async delete(@Param('dictionaryId', ParseIntPipe) id: number): Promise<number> {
    return this.dictionaryService.delete(id);
  }
}
