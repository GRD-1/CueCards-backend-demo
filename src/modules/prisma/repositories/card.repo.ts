import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CardInterface } from '@/modules/card/card.interface';

@Injectable()
export class CardRepo {
  constructor(private readonly db: PrismaService) {}

  async create(payload: CardInterface, userId: number): Promise<number> {
    const newCard = await this.db.card.create({
      data: {
        ...payload,
        authorId: userId,
      },
    });

    return newCard.id;
  }

  async findMany(page: number, pageSize: number): Promise<Card[]> {
    return this.db.card.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOneById(id: number): Promise<Card> {
    return this.db.card.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateOneById(cardId: number, payload: Partial<CardInterface>): Promise<number> {
    const updatedCard = await this.db.card.update({
      where: { id: cardId },
      data: payload,
    });

    return updatedCard.id;
  }

  async delete(cardId: number): Promise<number> {
    const deletedCard = await this.db.card.delete({
      where: { id: cardId },
    });

    return deletedCard.id;
  }
}
