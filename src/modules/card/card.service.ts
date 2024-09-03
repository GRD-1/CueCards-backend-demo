import { Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import {
  CardAndTagsInterface,
  CardTagInterface,
  GetCardListFullRespInterface,
  GetCardListInterface,
  GetListWithFirstRespInterface,
  UpdateCardInterface,
} from '@/modules/card/card.interface';
import { CardWitTagsEntity } from '@/modules/card/card.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepo) {}

  async create(payload: CardAndTagsInterface, userId: string): Promise<number> {
    const existingCardId = await this.cardRepo.getIdByValue(payload.fsValue, payload.bsValue);
    if (existingCardId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A card with that value already exists');
    }

    return this.cardRepo.create(payload, userId);
  }

  async getList(args: GetCardListInterface): Promise<GetCardListFullRespInterface> {
    const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
      this.cardRepo.getList(args),
      this.cardRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: cards.length, totalRecords, cards };
  }

  async getListWithFirst(args: GetCardListInterface): Promise<GetListWithFirstRespInterface> {
    let firstCard: CardWitTagsEntity | null = null;

    const list = await this.getList(args);

    if (list.cards.length) {
      firstCard = await this.findOneById(list.cards[0].id);
    }

    return { ...list, firstCard };
  }

  async findOneById(cardId: number): Promise<CardWitTagsEntity> {
    return this.cardRepo.findOneById(cardId);
  }

  async updateOneById(cardId: number, payload: Partial<CardAndTagsInterface>, userId: string): Promise<number> {
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

  async delete(cardId: number, userId: string): Promise<number> {
    await this.checkEditingRights(cardId, userId);

    return this.cardRepo.delete(cardId);
  }

  async checkEditingRights(cardId: number, userId: string): Promise<void> {
    const card = await this.cardRepo.findOneById(cardId);
    if (card.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, 'You can only change your own records.');
    }
  }

  async hide(cardId: number, userId: string): Promise<number> {
    return this.cardRepo.hide(cardId, userId);
  }

  async display(cardId: number, userId: string): Promise<number> {
    return this.cardRepo.display(cardId, userId);
  }
}
