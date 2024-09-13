import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import {
  GetManyLanguagesDto,
  GetManyLanguagesRespDto,
  LanguageDto,
  LanguageRespDto,
} from '@/modules/language/language.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { LanguageService } from './language.service';
import { UserId } from '@/decorators/user-id.decorator';

@ApiTags('languages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new language' })
  @ApiBody({ type: LanguageDto })
  @ApiCreatedResponse({ description: 'The new language has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async create(@Body() payload: LanguageDto, @UserId() userId: string): Promise<number> {
    return this.languageService.create(payload.name, payload.acronym, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get languages according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for records created by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'language name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetManyLanguagesRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findMany(@Query() query: GetManyLanguagesDto, @UserId() userId: string): Promise<GetManyLanguagesRespDto> {
    return this.languageService.findMany({ ...query, userId });
  }

  @Get(':languageId/get-one')
  @ApiOperation({ summary: 'Get a language with a specific id' })
  @ApiParam({ name: 'languageId', required: true, description: 'Language id' })
  @ApiOkResponse({ description: 'The language has been found', type: LanguageRespDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@Param('languageId', ParseIntPipe) languageId: number): Promise<LanguageRespDto> {
    return this.languageService.findOneById(languageId);
  }

  @Patch(':languageId/update')
  @ApiOperation({ summary: 'Update a language with a specified id' })
  @ApiParam({ name: 'languageId', required: true, description: 'Language id' })
  @ApiBody({ type: String, examples: { example1: { value: { name: 'italian', acronym: 'it' } } } })
  @ApiOkResponse({ description: 'The language has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid language data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async update(
    @Param('languageId') languageId: number,
    @Body() payload: LanguageDto,
    @UserId() userId: string,
  ): Promise<number> {
    return this.languageService.updateOneById(languageId, payload, userId);
  }

  @Delete(':languageId/delete')
  @ApiOperation({ summary: 'Delete a language with a specified id' })
  @ApiParam({ name: 'languageId', required: true, description: 'Language id' })
  @ApiOkResponse({ description: 'The language has been deleted. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async delete(@Param('languageId') languageId: number, @UserId() userId: string): Promise<number> {
    return this.languageService.delete(languageId, userId);
  }
}
