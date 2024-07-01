import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import {
  CardAndTagsInterface,
  CardTagInterface,
  FindManyCardsFullRespInterface,
  FindManyCardsInterface,
  UpdateCardInterface,
} from '@/modules/card/card.interface';
import { CardEntity } from '@/modules/card/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepo) {}

  async create(payload: CardAndTagsInterface, userId: number): Promise<number> {
    const existingCard = await this.cardRepo.findOneByValue(payload.fsValue, payload.bsValue);
    if (existingCard) {
      throw new HttpException('A card with that value already exists', HttpStatus.BAD_REQUEST);
    }

    return this.cardRepo.create(payload, userId);
  }

  async findMany(args: FindManyCardsInterface): Promise<FindManyCardsFullRespInterface> {
    const [{ page, pageSize, cards }, totalRecords] = await Promise.all([
      this.cardRepo.findMany(args),
      this.cardRepo.getCount(args.authorId),
    ]);

    return { page, pageSize, records: cards.length, totalRecords, cards };
  }

  async findOneById(cardId: number): Promise<CardEntity | null> {
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
