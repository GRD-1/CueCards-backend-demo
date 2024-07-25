import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import {
  CardAndTagsInterface,
  CardTagInterface,
  FindManyCardsFullRespInterface,
  FindManyCardsInterface,
  GetSettingsFullRespInterface,
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

  // async findMany(args: FindManyCardsInterface): Promise<FindManyCardsFullRespInterface> {
  //   const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
  //     this.cardRepo.findMany(args),
  //     this.cardRepo.getTotalCount(args),
  //   ]);
  //
  //   return { page, pageSize, records: cards.length, totalRecords, cards };
  // }
  //
  // async getCardListWithSettings(args: FindManyCardsInterface): Promise<GetSettingsFullRespInterface> {
  //   const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
  //     this.cardRepo.getCardListWithSettings(args),
  //     this.cardRepo.getTotalCount(args),
  //   ]);
  //
  //   return { page, pageSize, records: cards.length, totalRecords, cards };
  // }
  //
  // async getTrainingList(args: FindManyCardsInterface): Promise<FindManyCardsFullRespInterface> {
  //   const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
  //     this.cardRepo.findMany({ ...args, withoutHidden: true }),
  //     this.cardRepo.getTotalCount({ ...args, withoutHidden: true }),
  //   ]);
  //
  //   return { page, pageSize, records: cards.length, totalRecords, cards };
  // }

  async findOneById(cardId: number): Promise<CardEntity> {
    return this.cardRepo.findOneById(cardId);
  }

  async updateOneById(cardId: number, payload: Partial<CardAndTagsInterface>, userId: number): Promise<number> {
    const { tags: newTags, ...cardData } = payload;
    let tagIdToDeleteArr: number[];
    let newTagsArr: CardTagInterface[];
    let args: UpdateCardInterface = { cardId, cardData };

    await this.checkEditingRights(cardId, userId);

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

  async delete(cardId: number, userId: number): Promise<number> {
    await this.checkEditingRights(cardId, userId);

    return this.cardRepo.delete(cardId);
  }

  async checkEditingRights(cardId: number, userId: number): Promise<void> {
    const card = await this.cardRepo.findOneById(cardId);
    if (card.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, 'You can only change your own records.');
    }
  }

  async hide(cardId: number, userId: number): Promise<number> {
    return this.cardRepo.hide(cardId, userId);
  }

  async display(cardId: number, userId: number): Promise<number> {
    return this.cardRepo.display(cardId, userId);
  }
}
