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
  GetDictionaryRespDto,
  GetManyDictionariesDto,
  GetManyDictRespDto,
  UpdateDictionaryDto,
} from '@/modules/dictionary/dictionary.dto';
import { DictionaryService } from './dictionary.service';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new dictionary' })
  @ApiOkResponse({ description: 'new dictionary id', type: Number })
  @ApiBadRequestResponse({ description: "Raises when dictionary's data is invalid" })
  async create(@Body() payload: CreateDictionaryDto, @User() user: UserEntity): Promise<number> {
    return this.dictionaryService.create(payload, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get dictionaries according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'title', required: false, type: String, description: 'dictionary title' })
  @ApiOkResponse({ type: GetManyDictRespDto })
  async findMany(@Query() query: GetManyDictionariesDto, @User() user: UserEntity): Promise<GetManyDictRespDto> {
    const authorId = query.byUser ? user.id : undefined;

    return this.dictionaryService.findMany({ ...query, authorId });
  }

  @Get(':dictionaryId')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiResponse({ status: 200, description: 'Dictionary found', type: GetDictionaryRespDto })
  @ApiResponse({ status: 204, description: 'No dictionary found', type: undefined })
  async findOneById(@Param('dictionaryId', ParseIntPipe) dictionaryId: number): Promise<GetDictionaryRespDto | null> {
    return this.dictionaryService.findOneById(dictionaryId);
  }

  @Patch(':dictionaryId')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiBody({ type: UpdateDictionaryDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'updated dictionary id', type: Number })
  @ApiBadRequestResponse({ description: 'Record not found' })
  async update(@Param('dictionaryId') dictionaryId: number, @Body() payload: UpdateDictionaryDto): Promise<number> {
    return this.dictionaryService.updateOneById(dictionaryId, payload);
  }

  @Delete(':dictionaryId')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'deleted dictionary id', type: Number })
  @ApiBadRequestResponse({ description: 'Record not found' })
  async delete(@Param('dictionaryId') dictionaryId: number): Promise<number> {
    return this.dictionaryService.delete(dictionaryId);
  }
}
