import { Injectable } from '@nestjs/common';
import {
  DictionaryAndTagsInterface,
  DictionaryTagInterface,
  GetDictListFullRespInterface,
  GetDictListInterface,
  GetListWithFirstRespInterface,
  UpdateDictionaryInterface,
} from '@/modules/dictionary/dictionary.interface';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import { DictionaryWithTagsAndCardsEntity } from '@/modules/dictionary/dictionary.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepo: DictionaryRepo) {}

  async create(payload: DictionaryAndTagsInterface, userId: number): Promise<number> {
    const existingDictionaryId = await this.dictionaryRepo.getIdByName(payload.name);
    if (existingDictionaryId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A dictionary with that name already exists');
    }

    return this.dictionaryRepo.create(payload, userId);
  }

  async getList(args: GetDictListInterface): Promise<GetDictListFullRespInterface> {
    const [{ page, pageSize, dictionaries }, totalRecords] = await Promise.all([
      this.dictionaryRepo.getList(args),
      this.dictionaryRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: dictionaries.length, totalRecords, dictionaries };
  }

  async getListWithFirst(args: GetDictListInterface): Promise<GetListWithFirstRespInterface> {
    let firstDictionary: DictionaryWithTagsAndCardsEntity | null = null;

    const list = await this.getList(args);

    if (list.dictionaries.length) {
      firstDictionary = await this.findOneById(list.dictionaries[0].id);
    }

    return { ...list, firstDictionary };
  }

  async getCustomizedDictionary(dictionaryId: number, userId: number): Promise<DictionaryWithTagsAndCardsEntity> {
    return this.dictionaryRepo.getCustomizedDictionary(dictionaryId, userId);
  }

  async getCustomizedWithFirst(args: GetDictListInterface): Promise<GetListWithFirstRespInterface> {
    let firstDictionary: DictionaryWithTagsAndCardsEntity | null = null;

    const list = await this.getList(args);

    if (list.dictionaries.length) {
      firstDictionary = await this.getCustomizedDictionary(list.dictionaries[0].id, args.userId);
    }

    return { ...list, firstDictionary };
  }

  async findOneById(dictionaryId: number): Promise<DictionaryWithTagsAndCardsEntity> {
    return this.dictionaryRepo.findOneById(dictionaryId);
  }

  async updateOneById(dictId: number, payload: Partial<DictionaryAndTagsInterface>, userId: number): Promise<number> {
    const { tags: newTags, ...dictionaryData } = payload;
    let tagIdToDeleteArr: number[];
    let newTagsArr: DictionaryTagInterface[];
    let args: UpdateDictionaryInterface = { dictionaryId: dictId, dictionaryData };

    await this.checkEditingRights(dictId, userId);

    if (newTags) {
      const oldTags = await this.dictionaryRepo.getDictionaryTags(dictId);
      const oldTagIdArr = oldTags.map((item) => item.tagId);
      const newTagIdSet = new Set(newTags);
      const uniqueInNewTags = newTags.filter((item) => !oldTagIdArr.includes(item));

      tagIdToDeleteArr = oldTagIdArr.filter((item) => !newTagIdSet.has(item));
      newTagsArr = uniqueInNewTags.map((tagId) => ({ dictionaryId: dictId, tagId }));
      args = { dictionaryId: dictId, dictionaryData, tagIdToDeleteArr, newTagsArr };
    }

    return this.dictionaryRepo.updateOneById(args);
  }

  async delete(dictionaryId: number, userId: number): Promise<number> {
    await this.checkEditingRights(dictionaryId, userId);

    return this.dictionaryRepo.delete(dictionaryId);
  }

  async checkEditingRights(dictionaryId: number, userId: number): Promise<void> {
    const dictionary = await this.dictionaryRepo.findOneById(dictionaryId);
    if (dictionary.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, 'You can only change your own records.');
    }
  }
}
