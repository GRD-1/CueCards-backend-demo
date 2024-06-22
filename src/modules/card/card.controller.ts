import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCardDto, GetCardRespDto } from '@/modules/card/get-card.dto';
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

  // @Post()
  // @ApiOperation({ summary: 'Create a new card' })
  // @ApiOkResponse({ type: GetCardRespDto })
  // @ApiBadRequestResponse({ description: 'Raises when card\'s data is invalid' })
  // async create(@Body() dto: CreateCardDto, @User() user: UserEntity): Promise<CardEntity> {
  //   return this.cardService.create(dto, user);
  // }

  @Get()
  @ApiOperation({ summary: 'Get many cards' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of entries per page' })
  @ApiOkResponse({ type: GetCardRespDto })
  async findAll(@Query() query: GetCardDto): Promise<GetCardRespDto> {
    console.log('\nquery', query);
    const { page, pageSize } = query;
    const cards = await this.cardService.findMany(page, pageSize);

    return { cards, page, pageSize, numberOfRecords: cards.length };
  }

  // @Get(':cardId')
  // @ApiOperation({ summary: 'Get a card with a specific id' })
  // @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async findOneById(@Param('cardId', new ParseIntPipe()) cardId: number): Promise<CardEntity | null> {
  //   return this.cardService.findOneById(cardId);
  // }
  //
  // @Patch(':cardId')
  // @ApiOperation({ summary: 'Update a card with a specified id' })
  // @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async update(@Param('cardId') cardId: number, @Body() dto: UpdateCardDto): Promise<string> {
  //   return this.cardService.update(cardId, dto);
  // }
  //
  // @Delete(':cardId')
  // @ApiOperation({ summary: 'Delete a card with a specified id' })
  // @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async remove(@Param('cardId') cardId: number): Promise<string> {
  //   return this.cardService.remove(cardId);
  // }
}
