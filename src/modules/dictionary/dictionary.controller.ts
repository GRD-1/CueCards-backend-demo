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
  GetManyDictionariesRespDto,
  UpdateDictionaryDto,
} from '@/modules/dictionary/dictionary.dto';
import { GetManyCardsRespDto } from '@/modules/card/card.dto';
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
  @ApiOperation({ summary: 'Get all available dictionary' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiOkResponse({ type: GetManyCardsRespDto })
  async findAll(@Query() query: GetManyDictionariesDto): Promise<GetManyDictionariesRespDto> {
    const { page, pageSize } = query;
    const cards = await this.dictionaryService.findMany(page, pageSize);

    return { cards, page, pageSize, numberOfRecords: cards.length };
  }

  @Get(':dictionaryId')
  @ApiOperation({ summary: 'Get a dictionary with a specific id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ type: GetDictionaryRespDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOneById(@Param('dictionaryId', ParseIntPipe) dictionaryId: number): Promise<GetDictionaryRespDto> {
    return this.dictionaryService.findOneById(dictionaryId);
  }

  @Patch(':dictionaryId')
  @ApiOperation({ summary: 'Update a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'dictionary identifier' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiBody({ type: UpdateDictionaryDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'updated dictionary id', type: Number })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async update(@Param('dictionaryId') dictionaryId: number, @Body() payload: UpdateDictionaryDto): Promise<number> {
    return this.dictionaryService.updateOneById(dictionaryId, payload);
  }

  @Delete(':dictionaryId')
  @ApiOperation({ summary: 'Delete a dictionary with a specified id' })
  @ApiParam({ name: 'dictionaryId', required: true, description: 'Dictionary id' })
  @ApiOkResponse({ description: 'deleted dictionary id', type: Number })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async remove(@Param('dictionaryId') dictionaryId: number): Promise<number> {
    return this.dictionaryService.delete(dictionaryId);
  }
}
