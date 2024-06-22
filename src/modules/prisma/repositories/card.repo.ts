import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CardRepo {
  constructor(private readonly db: PrismaService) {}

  async findMany(page: number, pageSize: number): Promise<Card[]> {
    return this.db.card.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOneById(id: number): Promise<Card | null> {
    return this.db.card.findFirst({
      where: {
        id,
      },
    });
  }
}
