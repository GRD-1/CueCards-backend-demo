import { BadRequestException, Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CardInterface, FindManyCardsInterface, FindManyCardsRespInterface } from '@/modules/card/card.interface';

@Injectable()
export class CardRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CardInterface, tagIdArr: number[], authorId: number): Promise<number> {
    let newCard: Card;
    if (tagIdArr.length < 1) {
      newCard = await this.prisma.card.create({
        data: {
          ...payload,
          authorId,
        },
      });
    } else {
      newCard = await this.prisma
        .$transaction(async (prisma) => {
          newCard = await prisma.card.create({
            data: {
              ...payload,
              authorId,
            },
          });
          const cardTags = tagIdArr.map((id) => ({ cardId: newCard.id, tagId: id }));
          await prisma.cardTag.createManyAndReturn({
            data: cardTags,
          });

          return newCard;
        })
        .catch(() => {
          if (!newCard) {
            throw new BadRequestException('failed to create a card. Transaction aborted!');
          } else {
            throw new BadRequestException('failed to link the tags. Transaction aborted!');
          }
        });
    }

    return newCard.id;
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsRespInterface> {
    const { page = 1, pageSize = 20, authorId, value } = args;

    const cards = await this.prisma.card.findMany({
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
    return this.prisma.card.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: { id },
    });
  }

  async findOneByValue(fsValue: string, bsValue: string): Promise<Card | null> {
    return this.prisma.card.findFirst({
      where: {
        OR: [{ fsValue }, { bsValue }],
      },
    });
  }

  async updateOneById(cardId: number, payload: Partial<CardInterface>): Promise<number> {
    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: payload,
    });

    return updatedCard.id;
  }

  async delete(cardId: number): Promise<number> {
    const deletedCard = await this.prisma.card.delete({
      where: { id: cardId },
    });

    return deletedCard.id;
  }
}
