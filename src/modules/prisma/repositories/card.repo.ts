import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CardInterface, FindManyCardsInterface, FindManyCardsRespInterface } from '@/modules/card/card.interface';

@Injectable()
export class CardRepo {
  constructor(private readonly db: PrismaService) {}

  async create(payload: CardInterface, authorId: number): Promise<number> {
    const newCard = await this.db.card.create({
      data: {
        ...payload,
        authorId,
      },
    });

    return newCard.id;
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsRespInterface> {
    const { page = 1, pageSize = 20, authorId, value } = args;

    const cards = await this.db.card.findMany({
      where: {
        AND: {
          authorId,
          OR: [{ fsValue: value }, { bsValue: value }],
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, cards };
  }

  async getCount(authorId?: number): Promise<number> {
    return this.db.card.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<Card | null> {
    return this.db.card.findUnique({
      where: { id },
    });
  }

  async findOneByValue(fsValue: string, bsValue: string): Promise<Card | null> {
    return this.db.card.findFirst({
      where: {
        OR: [{ fsValue }, { bsValue }],
      },
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
