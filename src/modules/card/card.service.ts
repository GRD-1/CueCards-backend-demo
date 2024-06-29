import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import {
  CreateCardInterface,
  FindManyCardsFullRespInterface,
  FindManyCardsInterface,
} from '@/modules/card/card.interface';
import { CardEntity } from '@/modules/card/card.entity';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepo, private readonly tagRepo: TagRepo) {}

  async create(payload: CreateCardInterface, userId: number): Promise<number> {
    const existingCard = await this.cardRepo.findOneByValue(payload.fsValue, payload.bsValue);
    if (existingCard) {
      throw new HttpException('A card with that value already exists', HttpStatus.BAD_REQUEST);
    }

    const { tags, ...newCardData } = payload;

    return this.cardRepo.create(newCardData, tags, userId);
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsFullRespInterface> {
    const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
      this.cardRepo.findMany(args),
      this.cardRepo.getCount(args.authorId),
    ]);

    return { page, pageSize, totalRecords, cards };
  }

  async findOneById(cardId: number): Promise<CardEntity | null> {
    return this.cardRepo.findOneById(cardId);
  }

  async updateOneById(cardId: number, payload: Partial<CreateCardInterface>): Promise<number> {
    return this.cardRepo.updateOneById(cardId, payload);
  }

  async delete(cardId: number): Promise<number> {
    return this.cardRepo.delete(cardId);
  }
}
