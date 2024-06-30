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
import {
  CardRespDto,
  CreateCardDto,
  GetManyCardsDto,
  GetManyCardsRespDto,
  UpdateCardDto,
} from '@/modules/card/card.dto';
import { plainToInstance } from 'class-transformer';
import { BadRequestExample } from '@/filters/errors/error.examples';
import { CardService } from './card.service';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('cards')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiOkResponse({ description: 'The card has been created', type: Number })
  @ApiBadRequestResponse({ description: 'Appears when the card data is invalid', type: BadRequestExample })
  async create(@Body() payload: CreateCardDto, @User() user: UserEntity): Promise<number> {
    return this.cardService.create(payload, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get cards according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiQuery({ name: 'byUser', required: false, type: Boolean, description: 'search records by user' })
  @ApiQuery({ name: 'value', required: false, type: String, description: 'card value (both of them)' })
  @ApiOkResponse({ description: 'The cards were found', type: GetManyCardsRespDto })
  @ApiBadRequestResponse({ description: 'Raises when params are invalid', type: BadRequestExample })
  async findMany(@Query() query: GetManyCardsDto, @User() user: UserEntity): Promise<GetManyCardsRespDto> {
    const authorId = query.byUser ? user?.id : undefined;
    const data = await this.cardService.findMany({ ...query, authorId });

    return plainToInstance(GetManyCardsRespDto, data, { enableImplicitConversion: true });
  }

  @Get(':cardId')
  @ApiOperation({ summary: 'Get a card with a specific id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'The card has been found', type: CardRespDto })
  @ApiResponse({ status: 204, description: 'The card was not found', type: undefined })
  async findOneById(@Param('cardId', ParseIntPipe) cardId: number): Promise<CardRespDto | null> {
    const data = await this.cardService.findOneById(cardId);

    return plainToInstance(CardRespDto, data, { enableImplicitConversion: true });
  }

  @Patch(':cardId')
  @ApiOperation({ summary: 'Update a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiBody({ type: UpdateCardDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'The card has been updated', type: Number })
  @ApiBadRequestResponse({ description: 'Record not found', type: BadRequestExample })
  async update(@Param('cardId') cardId: number, @Body() payload: UpdateCardDto): Promise<number> {
    return this.cardService.updateOneById(cardId, payload);
  }

  @Delete(':cardId')
  @ApiOperation({ summary: 'Delete a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'deleted card id', type: Number })
  @ApiBadRequestResponse({ description: 'Record not found', type: BadRequestExample })
  async delete(@Param('cardId') cardId: number): Promise<number> {
    return this.cardService.delete(cardId);
  }
}
