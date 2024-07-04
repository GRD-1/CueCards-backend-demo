import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CardAndTagsInterface,
  CardTagInterface,
  FindManyCardsInterface,
  FindManyCardsRespInterface,
  UpdateCardInterface,
} from '@/modules/card/card.interface';
import { CardEntity } from '@/modules/card/card.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

const CARD_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  fsLanguage: true,
  fsValue: true,
  fsDescription: true,
  fsMeaningVariants: true,
  fsWrongMeanings: true,
  fsTranscription: true,
  fsSynonyms: true,
  fsAudio: true,
  fsHint: true,
  bsLanguage: true,
  bsValue: true,
  bsDescription: true,
  bsMeaningVariants: true,
  bsWrongMeanings: true,
  bsTranscription: true,
  bsSynonyms: true,
  bsAudio: true,
  bsHint: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          authorId: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class CardRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CardAndTagsInterface, authorId: number): Promise<number> {
    const { tags, ...newCardData } = payload;
    let newCard: Card;

    if (tags.length > 0) {
      newCard = await this.prisma
        .$transaction(async (prisma) => {
          newCard = await prisma.card.create({
            data: {
              ...newCardData,
              authorId,
            },
          });

          const cardTags = tags.map((id) => ({ cardId: newCard.id, tagId: id }));

          await prisma.cardTag.createManyAndReturn({
            data: cardTags,
          });

          return newCard;
        })
        .catch((err) => {
          if (!newCard) {
            throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, 'failed to create a card!', err);
          } else {
            throw new CueCardsError(
              CCBK_ERROR_CODES.INVALID_DATA,
              "failed to link the tags. The card wasn't created!",
              err,
            );
          }
        });
    } else {
      newCard = await this.prisma.card.create({
        data: {
          ...newCardData,
          authorId,
        },
      });
    }

    return newCard.id;
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsRespInterface> {
    const { page = 1, pageSize = 20, authorId, value } = args;
    const cards = await this.prisma.card.findMany({
      select: CARD_SELECT_OPTIONS,
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

  async findOneById(id: number): Promise<CardEntity> {
    return this.prisma.card.findUniqueOrThrow({
      select: CARD_SELECT_OPTIONS,
      where: { id },
    });
  }

  async getIdByValue(fsValue: string, bsValue: string): Promise<number | null> {
    const card = await this.prisma.card.findFirst({
      select: { id: true },
      where: {
        OR: [{ fsValue }, { bsValue }],
      },
    });

    return card?.id || null;
  }

  async updateOneById(args: UpdateCardInterface): Promise<number> {
    const { cardId, cardData, tagIdToDeleteArr, newTagsArr } = args;
    let updatedCard: Card;

    if (tagIdToDeleteArr || newTagsArr) {
      await this.prisma
        .$transaction(async (prisma) => {
          if (tagIdToDeleteArr) {
            await prisma.cardTag.deleteMany({
              where: {
                cardId,
                tagId: {
                  in: tagIdToDeleteArr,
                },
              },
            });
          }

          if (newTagsArr) {
            await prisma.cardTag.createMany({
              data: newTagsArr,
            });
          }

          await prisma.card.update({
            where: { id: cardId },
            data: {
              ...cardData,
            },
          });

          return updatedCard;
        })
        .catch((err) => {
          if (!updatedCard) {
            throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, 'failed to update a card!', err);
          } else {
            throw new CueCardsError(
              CCBK_ERROR_CODES.INVALID_DATA,
              "failed to link the tags. The card wasn't updated!",
              err,
            );
          }
        });
    } else {
      updatedCard = await this.prisma.card.update({
        where: { id: cardId },
        data: {
          ...cardData,
        },
      });
    }

    return cardId;
  }

  async delete(cardId: number): Promise<number> {
    const deletedCard = await this.prisma.card.delete({
      where: { id: cardId },
    });

    return deletedCard.id;
  }

  async getCardTags(cardId: number): Promise<CardTagInterface[]> {
    return this.prisma.cardTag.findMany({
      where: { cardId },
    });
  }
}
