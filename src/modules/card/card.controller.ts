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
import {
  CardWithTagsRespDto,
  CreateCardDto,
  GetCardListDto,
  GetCardListRespDto,
  GetCardListWithFRespDto,
  UpdateCardDto,
} from '@/modules/card/card.dto';
import { plainToInstance } from 'class-transformer';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { UserId } from '@/decorators/user-id.decorator';
import { CardService } from './card.service';

@ApiTags('cards')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new card' })
  @ApiBody({ type: CreateCardDto })
  @ApiCreatedResponse({ description: 'The new card has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async create(@Body() payload: CreateCardDto, @UserId() userId: number): Promise<number> {
    return this.cardService.create(payload, userId);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get a card list according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for cards created by user' })
  @ApiQuery({ name: 'value', required: false, type: String, description: 'search for records by card value' })
  @ApiQuery({ name: 'partOfValue', required: false, type: String, description: 'search by part of card value' })
  @ApiOkResponse({ description: 'Successful request', type: GetCardListRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getList(@Query() query: GetCardListDto, @UserId() userId: number): Promise<GetCardListRespDto> {
    const data = await this.cardService.getList({ ...query, userId });

    return plainToInstance(GetCardListRespDto, data, { enableImplicitConversion: true });
  }

  @Get('list-with-first')
  @ApiOperation({ summary: 'Get a card list  and the first card' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search for cards created by user' })
  @ApiQuery({ name: 'value', required: false, type: String, description: 'search for records by card value' })
  @ApiQuery({ name: 'partOfValue', required: false, type: String, description: 'search by part of card value' })
  @ApiOkResponse({ description: 'Successful request', type: GetCardListWithFRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getListWithFirst(@Query() query: GetCardListDto, @UserId() userId: number): Promise<GetCardListWithFRespDto> {
    const data = await this.cardService.getListWithFirst({ ...query, userId });

    return plainToInstance(GetCardListWithFRespDto, data, { enableImplicitConversion: true });
  }

  @Get(':cardId/get-one')
  @ApiOperation({ summary: 'Get a card with a specific id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'The card has been found', type: CardWithTagsRespDto })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async findOneById(@Param('cardId', ParseIntPipe) cardId: number): Promise<CardWithTagsRespDto> {
    const data = await this.cardService.findOneById(cardId);

    return plainToInstance(CardWithTagsRespDto, data, { enableImplicitConversion: true });
  }

  @Patch(':cardId/update')
  @ApiOperation({ summary: 'Update a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiBody({ type: UpdateCardDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'The card has been updated. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid card data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async update(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() payload: UpdateCardDto,
    @UserId() userId: number,
  ): Promise<number> {
    return this.cardService.updateOneById(cardId, payload, userId);
  }

  @Delete(':cardId/delete')
  @ApiOperation({ summary: 'Delete a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'The card has been deleted. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async delete(@Param('cardId', ParseIntPipe) cardId: number, @UserId() userId: number): Promise<number> {
    return this.cardService.delete(cardId, userId);
  }

  @Post(':cardId/hide')
  @ApiOperation({ summary: 'Hide a card from the training list' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'The card has been hidden. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async hide(@Param('cardId', ParseIntPipe) cardId: number, @UserId() userId: number): Promise<number> {
    return this.cardService.hide(cardId, userId);
  }

  @Post(':cardId/display')
  @ApiOperation({ summary: 'Display a card in the training list' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'The card is now displayed in the training list. The id:', schema: { example: 123 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async show(@Param('cardId', ParseIntPipe) cardId: number, @UserId() userId: number): Promise<number> {
    return this.cardService.display(cardId, userId);
  }
}
