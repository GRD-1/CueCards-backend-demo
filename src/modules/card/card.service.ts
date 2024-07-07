import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import {
  CardAndTagsInterface,
  CardTagInterface,
  FindManyCardsFullRespInterface,
  FindManyCardsInterface,
  UpdateCardInterface,
} from '@/modules/card/card.interface';
import { CardEntity } from '@/modules/card/card.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepo) {}

  async create(payload: CardAndTagsInterface, userId: number): Promise<number> {
    const existingCardId = await this.cardRepo.getIdByValue(payload.fsValue, payload.bsValue);
    if (existingCardId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A card with that value already exists');
    }

    return this.cardRepo.create(payload, userId);
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsFullRespInterface> {
    let page: number;
    let pageSize: number;
    let cards: CardEntity[];
    let totalRecords: number;

    if (args.valuePartial) {
      [{ page, pageSize, cards }, totalRecords] = await Promise.all([
        this.cardRepo.findManyPartial(args),
        this.cardRepo.getCount(args.authorId),
      ]);
    } else {
      [{ page, pageSize, cards }, totalRecords] = await Promise.all([
        this.cardRepo.findMany(args),
        this.cardRepo.getCount(args.authorId),
      ]);
    }

    return { page, pageSize, records: cards.length, totalRecords, cards };
  }

  async findOneById(cardId: number): Promise<CardEntity> {
    return this.cardRepo.findOneById(cardId);
  }

  async updateOneById(cardId: number, payload: Partial<CardAndTagsInterface>): Promise<number> {
    const { tags: newTags, ...cardData } = payload;
    let tagIdToDeleteArr: number[];
    let newTagsArr: CardTagInterface[];
    let args: UpdateCardInterface = { cardId, cardData };

    if (newTags) {
      const oldTags = await this.cardRepo.getCardTags(cardId);
      const oldTagIdArr = oldTags.map((item) => item.tagId);
      const newTagIdSet = new Set(newTags);
      const uniqueInNewTags = newTags.filter((item) => !oldTagIdArr.includes(item));

      tagIdToDeleteArr = oldTagIdArr.filter((item) => !newTagIdSet.has(item));
      newTagsArr = uniqueInNewTags.map((tagId) => ({ cardId, tagId }));
      args = { cardId, cardData, tagIdToDeleteArr, newTagsArr };
    }

    return this.cardRepo.updateOneById(args);
  }

  async delete(cardId: number): Promise<number> {
    return this.cardRepo.delete(cardId);
  }
}
