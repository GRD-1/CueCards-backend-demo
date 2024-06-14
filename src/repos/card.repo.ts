import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Card } from '@prisma/client';

@Injectable()
export class CardRepo {
  constructor(private readonly db: PrismaService) {}

  async findMany(): Promise<Card[]> {
    const cards: Card[] = await this.db.card.findMany();

    return cards;
  }

  async findOneById(id: number): Promise<Card | null> {
    return this.db.card.findFirst({
      where: {
        id,
      },
    });
  }
}
