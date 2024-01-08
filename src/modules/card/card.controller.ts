import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param, ParseIntPipe,
  Patch,
  Post, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCardDto } from './dto/create-card.dto';
import { CardEntity } from './entities/card.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardService } from './card.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('library/card')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('library/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateCardDto, @User() user: UserEntity): Promise<CardEntity> {
    return this.cardService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all available cards' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<{ value: string, translate: string }[]> {
    const cardArr = await this.cardService.findAll();
    return cardArr.map((card: CardEntity) => ({ value: card.fsValue, translate: card.bsValue }));
  }

  @Get(':cardId')
  @ApiOperation({ summary: 'Get a card with a specific id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('cardId', new ParseIntPipe()) cardId: number): Promise<CardEntity | null> {
    return this.cardService.findOne(cardId);
  }

  @Patch(':cardId')
  @ApiOperation({ summary: 'Update a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('cardId') cardId: number, @Body() dto: UpdateCardDto): Promise<string> {
    return this.cardService.update(cardId, dto);
  }

  @Delete(':cardId')
  @ApiOperation({ summary: 'Delete a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('cardId') cardId: number): Promise<string> {
    return this.cardService.remove(cardId);
  }
}
