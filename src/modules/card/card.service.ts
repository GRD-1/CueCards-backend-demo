import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import { CardInterface } from '@/modules/card/card.interface';
import { CardEntity } from '@/modules/card/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepo) {}

  async create(payload: CardInterface, userId: number): Promise<number> {
    return this.cardRepo.create(payload, userId);
  }

  async findMany(page: number, pageSize: number): Promise<CardEntity[]> {
    return this.cardRepo.findMany(page, pageSize);
  }

  async findOneById(cardId: number): Promise<CardEntity | null> {
    return this.cardRepo.findOneById(cardId);
  }

  async updateOneById(cardId: number, payload: Partial<CardInterface>): Promise<number> {
    return this.cardRepo.updateOneById(cardId, payload);
  }

  async delete(cardId: number): Promise<number> {
    return this.cardRepo.delete(cardId);
  }
}
