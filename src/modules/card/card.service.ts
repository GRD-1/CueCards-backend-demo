import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import { CardEntity } from '@/modules/card/card.entity';

@Injectable()
export class CardService {
  constructor(
    // @InjectRepository(CardEntity)
    private readonly cardRepo: CardRepo,
  ) {}

  // async create(dto: CreateCardDto, user: UserEntity): Promise<CardEntity> {
  //   const card = new CardEntity();
  //   Object.assign(card, dto);
  //   if (!dto.tags) card.tags = [];
  //   card.author = user;
  //   return this.cardRepo.save(card);
  // }

  async findMany(page: number, pageSize: number): Promise<CardEntity[]> {
    return this.cardRepo.findMany(page, pageSize);
  }

  async findOneById(cardId: number): Promise<any | null> {
    return this.cardRepo.findOneById(cardId);
  }

  async update(cardId: number, dto: unknown): Promise<string> {
    return `the card with id = ${cardId} has been updated!`;
  }

  async remove(cardId: number): Promise<string> {
    return `the card with id = ${cardId} has been deleted!`;
  }
}
