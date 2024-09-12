import { Inject, Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CARD_LIST_SELECT_OPTIONS,
  CARD_SELECT_OPTIONS,
} from '@/modules/prisma/repositories/select-options/card.select-options';
import {
  CardAndTagsInterface,
  CardTagInterface,
  GetCardListConditionsInterface,
  GetCardListInterface,
  GetCardListRespInterface,
  SearchConditionsArgsType,
  UpdateCardInterface,
} from '@/modules/card/card.interface';
import { CardWitTagsEntity } from '@/modules/card/card.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { INVALID_RELATION_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class CardRepo {
  constructor(
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    private readonly prisma: PrismaService,
  ) {}

  async create(payload: CardAndTagsInterface, authorId: string): Promise<number> {
    const { tags, ...newCardData } = payload;
    let newCard: Card;

    if (tags.length > 0) {
      newCard = await this.prisma.$transaction(async (prisma) => {
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
      });
      // .catch((err) => {
      //   if (!newCard) {
      //     throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA);
      //   } else {
      //     throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, INVALID_RELATION_ERR_MSG);
      //   }
      // });
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

  async getList(args: GetCardListInterface): Promise<GetCardListRespInterface> {
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: GetCardListConditionsInterface = this.getCardSearchConditions(args);

    const cards = await this.prisma.card.findMany({
      select: {
        ...CARD_LIST_SELECT_OPTIONS,
      },
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, cards };
  }

  async getTotalCount(args: SearchConditionsArgsType): Promise<number> {
    const searchConditions: GetCardListConditionsInterface = this.getCardSearchConditions(args);

    return this.prisma.card.count({ where: searchConditions });
  }

  getCardSearchConditions(args: SearchConditionsArgsType): GetCardListConditionsInterface {
    const { userId, byUser, value, partOfValue } = args;
    const searchConditions: GetCardListConditionsInterface = {};

    searchConditions.authorId = byUser ? userId : { in: [userId, this.userConf.defaultUserId] };
    if (partOfValue) {
      searchConditions.OR = [{ fsValue: { contains: partOfValue } }, { bsValue: { contains: partOfValue } }];
    } else if (value) {
      searchConditions.OR = [{ fsValue: value }, { bsValue: value }];
    }

    return searchConditions;
  }

  async findOneById(id: number): Promise<CardWitTagsEntity> {
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
      updatedCard = await this.prisma
        .$transaction(async (prisma) => {
          updatedCard = await prisma.card.update({
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
              throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND);
            case 'P2002':
              throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION);
            case 'P2003':
              throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, INVALID_RELATION_ERR_MSG);
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

    return updatedCard.id;
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

  async hide(cardId: number, userId: string): Promise<number> {
    const deletedCard = await this.prisma.cardIsHidden
      .upsert({
        where: {
          cardId_userId: {
            cardId,
            userId,
          },
        },
        create: {
          cardId,
          userId,
        },
        update: {},
      })
      .catch((err) => {
        if (err.code === 'P2003') {
          throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND);
        }
        throw err;
      });

    return deletedCard.cardId;
  }

  async display(cardId: number, userId: string): Promise<number> {
    const deletedCard = await this.prisma.cardIsHidden
      .delete({
        where: {
          cardId_userId: {
            cardId,
            userId,
          },
        },
      })
      .catch((err) => {
        if (err.code === 'P2025') {
          throw new CueCardsError(
            CCBK_ERROR_CODES.RECORD_NOT_FOUND,
            "The card already displayed or doesn't exist!",
            err,
          );
        }
        throw err;
      });

    return deletedCard.cardId;
  }
}
