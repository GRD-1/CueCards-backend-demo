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
import { GetManyTagsDto, GetManyTagsRespDto, TagDto, TagRespDto } from '@/modules/tag/tag.dto';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { TagService } from './tag.service';
import { UserId } from '../user/decorators/user-id.decorator';

@ApiTags('tags')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: TagDto })
  @ApiCreatedResponse({ description: 'The new tag has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async create(@Body() payload: TagDto, @UserId() userId: number): Promise<number> {
    return this.tagService.create(payload.name, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get tags according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'tag name' })
  @ApiQuery({ name: 'partOfName', required: false, type: String, description: 'search for records by name part' })
  @ApiOkResponse({ description: 'Successful request', type: GetManyTagsRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findMany(@Query() query: GetManyTagsDto, @UserId() authorId: number): Promise<GetManyTagsRespDto> {
    return this.tagService.findMany({ ...query, authorId });
  }

  @Get(':tagId/get-one')
  @ApiOperation({ summary: 'Get a tag with a specific id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiOkResponse({ description: 'The tag has been found', type: TagRespDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@Param('tagId', ParseIntPipe) tagId: number): Promise<TagRespDto> {
    return this.tagService.findOneById(tagId);
  }

  @Patch(':tagId/update')
  @ApiOperation({ summary: 'Update a tag with a specified id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiBody({ type: String, examples: { example1: { value: { name: 'tag1' } } } })
  @ApiOkResponse({ description: 'The tag has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid tag data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async update(@Param('tagId') tagId: number, @Body() payload: TagDto, @UserId() userId: number): Promise<number> {
    return this.tagService.updateOneById(tagId, payload, userId);
  }

  @Delete(':tagId/delete')
  @ApiOperation({ summary: 'Delete a tag with a specified id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiOkResponse({ description: 'The tag has been deleted. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async delete(@Param('tagId') tagId: number, @UserId() userId: number): Promise<number> {
    return this.tagService.delete(tagId, userId);
  }
}
