import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(@InjectRepository(CardEntity) private readonly cardRepository: Repository<CardEntity>) {}

  async create(dto: CreateCardDto): Promise<string> {
    return 'A new card has been created!';
  }

  async findAll(): Promise<CardEntity[]> {
    return this.cardRepository.find();
  }

  async findOne(cardId: number): Promise<CardEntity | null> {
    return this.cardRepository.findOneBy({ id: cardId });
  }

  async update(cardId: number, dto: UpdateCardDto): Promise<string> {
    return `the card with id = ${cardId} has been updated!`;
  }

  async remove(cardId: number): Promise<string> {
    return `the card with id = ${cardId} has been deleted!`;
  }
}
