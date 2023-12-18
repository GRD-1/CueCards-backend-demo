import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  async create(dto: CreateCardDto): Promise<string> {
    return 'A new card has been created!';
  }

  async findAll(): Promise<string> {
    return 'these is all available card';
  }

  async findOne(cardId: number): Promise<string> {
    return `the card with id = ${cardId}`;
  }

  async update(cardId: number, dto: UpdateCardDto): Promise<string> {
    return `the card with id = ${cardId} has been updated!`;
  }

  async remove(cardId: number): Promise<string> {
    return `the card with id = ${cardId} has been deleted!`;
  }
}
