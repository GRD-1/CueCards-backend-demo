import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import {
  CreateCardDto,
  GetCardRespDto,
  GetManyCardsDto,
  GetManyCardsRespDto,
  UpdateCardDto,
} from '@/modules/card/card.dto';
import { CardEntity } from '@/modules/card/card.entity';
import { CardService } from './card.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('library/cards')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('library/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiOkResponse({ description: 'new card id', type: Number })
  @ApiBadRequestResponse({ description: "Raises when card's data is invalid" })
  async create(@Body() payload: CreateCardDto, @User() user: UserEntity): Promise<number> {
    return this.cardService.create(payload, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get many cards' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiOkResponse({ type: GetManyCardsRespDto })
  async findAll(@Query() query: GetManyCardsDto): Promise<GetManyCardsRespDto> {
    const { page, pageSize } = query;
    const cards = await this.cardService.findMany(page, pageSize);

    return { cards, page, pageSize, numberOfRecords: cards.length };
  }

  @Get(':cardId')
  @ApiOperation({ summary: 'Get a card with a specific id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ type: GetCardRespDto })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findOneById(@Param('cardId', ParseIntPipe) cardId: number): Promise<GetCardRespDto> {
    const card = await this.cardService.findOneById(cardId);
    if (!card) {
      throw new NotFoundException(`Card with id ${cardId} not found`);
    }

    return card;
  }

  @Patch(':cardId')
  @ApiOperation({ summary: 'Update a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiBody({ type: UpdateCardDto, examples: { example1: { value: { tags: ['tag1', 'tag2'] } } } })
  @ApiOkResponse({ description: 'updated card id', type: Number })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async update(@Param('cardId') cardId: number, @Body() payload: UpdateCardDto): Promise<number> {
    const id = await this.cardService.updateOneById(cardId, payload);
    if (!id) {
      throw new NotFoundException(`Card with id ${cardId} not found`);
    }

    return id;
  }

  @Delete(':cardId')
  @ApiOperation({ summary: 'Delete a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiOkResponse({ description: 'deleted card id', type: Number })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async remove(@Param('cardId') cardId: number): Promise<number> {
    const id = await this.cardService.delete(cardId);
    if (!id) {
      throw new NotFoundException(`Card with id ${cardId} not found`);
    }

    return id;
  }
}
