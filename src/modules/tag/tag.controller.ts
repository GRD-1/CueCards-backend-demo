import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
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
// import { GetManyTagsDto, GetManyTagsRespDto, GetTagRespDto, UpdateTagDto } from '@/modules/tag/tag.dto';
import { BadRequestExample } from '@/filters/errors/error.examples';
import { GetManyTagsDto, GetManyTagsRespDto, GetTagRespDto } from '@/modules/tag/tag.dto';
import { Response } from 'express';
import { TagService } from './tag.service';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('tags')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: String, examples: { example1: { value: { name: 'tag1' } } } })
  @ApiOkResponse({ description: 'new tag id', type: Number })
  @ApiBadRequestResponse({ description: "Raises when tag's data is invalid", type: BadRequestExample })
  async create(@Body('name') name: string, @User() user: UserEntity): Promise<number> {
    return this.tagService.create(name, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tags according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'tag name' })
  @ApiOkResponse({ type: GetManyTagsRespDto })
  @ApiBadRequestResponse({ description: 'Raises when the query parameters are invalid', type: BadRequestExample })
  async findMany(@Query() query: GetManyTagsDto, @User() user: UserEntity): Promise<GetManyTagsRespDto> {
    const authorId = query.byUser ? user.id : undefined;

    return this.tagService.findMany({ ...query, authorId });
  }

  @Get(':tagId')
  @ApiOperation({ summary: 'Get a tag with a specific id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiResponse({ status: 200, description: 'Tag found', type: GetTagRespDto })
  @ApiResponse({ status: 204, description: 'No tags found', type: undefined })
  @ApiBadRequestResponse({ description: 'Raises when the query parameters are invalid', type: BadRequestExample })
  async findOneById(@Param('tagId', ParseIntPipe) tagId: number, @Res() res: Response): Promise<Response> {
    const tag = await this.tagService.findOneById(tagId);
    if (!tag) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    return res.status(HttpStatus.OK).json(tag);
  }

  @Patch(':tagId')
  @ApiOperation({ summary: 'Update a tag with a specified id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiBody({ type: String, examples: { example1: { value: { name: 'tag1' } } } })
  @ApiOkResponse({ description: 'updated tag id', type: Number })
  @ApiBadRequestResponse({ description: 'The record is not found', type: BadRequestExample })
  async update(@Param('tagId') tagId: number, @Body('name') name: string): Promise<number> {
    return this.tagService.updateOneById(tagId, name);
  }

  @Delete(':tagId')
  @ApiOperation({ summary: 'Delete a tag with a specified id' })
  @ApiParam({ name: 'tagId', required: true, description: 'Tag id' })
  @ApiOkResponse({ description: 'The tag was successfully deleted', type: Number })
  @ApiBadRequestResponse({ description: 'The record was not found', type: BadRequestExample })
  async delete(@Param('tagId') tagId: number): Promise<number> {
    return this.tagService.delete(tagId);
  }
}
