import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CardRepo {
  constructor(private readonly db: PrismaService) {}

  async findMany(): Promise<Card[]> {
    return this.db.card.findMany();
  }

  async findOneById(id: number): Promise<Card | null> {
    return this.db.card.findFirst({
      where: {
        id
      }
    });
  }
}
