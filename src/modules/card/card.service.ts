import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    // @InjectRepository(CardEntity)
    private readonly cardRepo: CardRepo
  ) {}

  // async create(dto: CreateCardDto, user: UserEntity): Promise<CardEntity> {
  //   const card = new CardEntity();
  //   Object.assign(card, dto);
  //   if (!dto.tags) card.tags = [];
  //   card.author = user;
  //   return this.cardRepo.save(card);
  // }
  //
  // async findAll(): Promise<CardEntity[]> {
  //   return this.cardRepo.find();
  // }

  async findOneById(cardId: number): Promise<any | null> {
    return this.cardRepo.findOneById(cardId);
  }

  async update(cardId: number, dto: UpdateCardDto): Promise<string> {
    return `the card with id = ${cardId} has been updated!`;
  }

  async remove(cardId: number): Promise<string> {
    return `the card with id = ${cardId} has been deleted!`;
  }
}
