import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CardAndTagsInterface,
  CardTagInterface,
  FindManyCardsConditionsInterface,
  FindManyCardsInterface,
  FindManyCardsRespInterface,
  GetCardListRespInterface,
  SearchConditionsArgsType,
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

const CARD_LIST_SELECT_OPTIONS = {
  id: true,
  fsValue: true,
  bsValue: true,
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
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: FindManyCardsConditionsInterface = this.getCardSearchConditions(args);

    const cards = await this.prisma.card.findMany({
      select: {
        ...CARD_SELECT_OPTIONS,
      },
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, cards };
  }

  async getList(args: FindManyCardsInterface): Promise<GetCardListRespInterface> {
    const { page = 1, pageSize = 20, authorId } = args;
    const searchConditions: FindManyCardsConditionsInterface = this.getCardSearchConditions(args);

    const cards = await this.prisma.card.findMany({
      select: {
        ...CARD_LIST_SELECT_OPTIONS,
        statistics: { where: { authorId } },
      },
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, cards };
  }

  async getTotalCount(args: SearchConditionsArgsType): Promise<number> {
    const searchConditions: FindManyCardsConditionsInterface = this.getCardSearchConditions(args);

    return this.prisma.card.count({ where: searchConditions });
  }

  getCardSearchConditions(args: SearchConditionsArgsType): FindManyCardsConditionsInterface {
    const { authorId, byUser, value, partOfValue } = args;
    const searchConditions: FindManyCardsConditionsInterface = {};

    searchConditions.authorId = byUser ? authorId : { in: [authorId, 0] };

    if (partOfValue) {
      searchConditions.OR = [{ fsValue: { contains: partOfValue } }, { bsValue: { contains: partOfValue } }];
    } else if (value) {
      searchConditions.OR = [{ fsValue: value }, { bsValue: value }];
    }

    return searchConditions;
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
          await prisma.card.update({
            where: { id: cardId },
            data: {
              ...cardData,
            },
          });

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

          return updatedCard;
        })
        .catch((err) => {
          switch (err.code) {
            case 'P2025':
              throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The card was not found!', err);
            case 'P2002':
              throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'This card value already exists', err);
            case 'P2003':
              throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The tag was not found!', err);
            default:
              throw err;
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
