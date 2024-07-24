import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from '@/modules/user/decorators/user-id.decorator';
import {
  CreateDictionaryDto,
  DictionaryRespWithoutTransform,
  GetListDto,
  GetListRespDto,
  GetListWithFirstRespDto,
  UpdateDictionaryDto,
} from '@/modules/dictionary/dictionary.dto';
import { plainToInstance } from 'class-transformer';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { DictionaryService } from './dictionary.service';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiBody({ type: CreateDictionaryDto })
  @ApiCreatedResponse({ description: 'The new dictionary has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async create(@Body() payload: CreateDictionaryDto, @UserId() userId: number): Promise<number> {
    return this.dictionaryService.create(payload, userId);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get a dictionary list according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'search for records by dictionary name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetListRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getList(@Query() query: GetListDto, @UserId() userId: number): Promise<GetListRespDto> {
    const data = await this.dictionaryService.getList({ ...query, userId });

    return plainToInstance(GetListRespDto, data, { enableImplicitConversion: true });
  }

  @Get('list-with-first')
  @ApiOperation({ summary: 'Get a dictionary list according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'search for records by dictionary name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetListWithFirstRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getListWithFirst(@Query() query: GetListDto, @UserId() userId: number): Promise<GetListWithFirstRespDto> {
    const data = await this.dictionaryService.getListWithFirst({ ...query, userId });

    return plainToInstance(GetListWithFirstRespDto, data, { enableImplicitConversion: true });
  }

  @Get('customized')
  @ApiOperation({ summary: 'Get the list of customized dictionaries' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'search for records by dictionary name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetListRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getCustomizedList(@Query() query: GetListDto, @UserId() userId: number): Promise<GetListRespDto> {
    const data = await this.dictionaryService.getList({ ...query, userId });

    return plainToInstance(GetListRespDto, data, { enableImplicitConversion: true });
  }

  @Get('customized-with-first')
  @ApiOperation({ summary: 'Get a dictionary list according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'search for records by dictionary name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetListWithFirstRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getCustomizedWithFirst(@Query() query: GetListDto, @UserId() userId: number): Promise<GetListWithFirstRespDto> {
    const data = await this.dictionaryService.getCustomizedWithFirst({ ...query, userId });

    return plainToInstance(GetListWithFirstRespDto, data, { enableImplicitConversion: true });
  }

  @Get('customized/:dictionaryId')
  @ApiOperation({ summary: 'Get a customized dictionary without hidden cards' })
  @ApiOkResponse({ description: 'Successful request', type: DictionaryRespWithoutTransform })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getCustomizedDictionary(
    @Param('dictionaryId', ParseIntPipe) id: number,
    @UserId() userId: number,
  ): Promise<DictionaryRespWithoutTransform> {
    return this.dictionaryService.getCustomizedDictionary(id, userId);
  }

  @Get(':dictionaryId/get-one')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'The dictionary has been found', type: DictionaryRespWithoutTransform })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@Param('dictionaryId', ParseIntPipe) id: number): Promise<DictionaryRespWithoutTransform> {
    return this.dictionaryService.findOneById(id);
  }

  @Patch(':dictionaryId/update')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiBody({ type: UpdateDictionaryDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'The dictionary has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid dictionary data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async update(
    @Param('dictionaryId', ParseIntPipe) id: number,
    @Body() payload: UpdateDictionaryDto,
    @UserId() userId: number,
  ): Promise<number> {
    return this.dictionaryService.updateOneById(id, payload, userId);
  }

  @Delete(':dictionaryId/delete')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'The dictionary has been deleted. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async delete(@Param('dictionaryId', ParseIntPipe) dictionaryId: number, @UserId() userId: number): Promise<number> {
    return this.dictionaryService.delete(dictionaryId, userId);
  }
}
