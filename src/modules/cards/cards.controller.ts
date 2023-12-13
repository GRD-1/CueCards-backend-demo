import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param, ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCardDto } from './dto/create-card.dto';
import { CardEntity } from './entities/cards.entity';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('library/cards')
@Controller('library/cards')
export class CardsController {
  @Post('create')
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() dto: CreateCardDto): Promise<string> {
    return 'A new card has been created!';
  }

  @Get()
  @ApiOperation({ summary: 'Get all available cards' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return 'these is all available cards';
  }

  @Get(':cardId')
  @ApiOperation({ summary: 'Get a card with a specific id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('cardId', new ParseIntPipe()) cardId: number): Promise<string> {
    return `the card with id = ${cardId}`;
  }

  @Patch(':cardId')
  @ApiOperation({ summary: 'Update a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('cardId') cardId: number, @Body() dto: UpdateCardDto): Promise<string> {
    return `the card with id = ${cardId} has been updated!`;
  }

  @Delete(':cardId')
  @ApiOperation({ summary: 'Delete a card with a specified id' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async remove(@Param('cardId') cardId: number): Promise<string> {
    return `the card with id = ${cardId} has been deleted!`;
  }
}
