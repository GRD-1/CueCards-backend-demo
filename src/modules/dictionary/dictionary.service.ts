import { Injectable } from '@nestjs/common';
import {
  DictionaryAndTagsInterface,
  DictionaryTagInterface,
  FindManyDictInterface,
  FindManyFullRespInterface,
  UpdateDictionaryInterface,
} from '@/modules/dictionary/dictionary.interface';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';
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

  async findMany(args: FindManyDictInterface): Promise<FindManyFullRespInterface> {
    const [{ page, pageSize, dictionaries }, totalRecords] = await Promise.all([
      this.dictionaryRepo.findMany(args),
      this.dictionaryRepo.getCount(args.authorId),
    ]);

    return { page, pageSize, records: dictionaries.length, totalRecords, dictionaries };
  }

  async findOneById(dictionaryId: number): Promise<DictionaryEntity> {
    return this.dictionaryRepo.findOneById(dictionaryId);
  }

  async updateOneById(dictionaryId: number, payload: Partial<DictionaryAndTagsInterface>): Promise<number> {
    const { tags: newTags, ...dictionaryData } = payload;
    let tagIdToDeleteArr: number[];
    let newTagsArr: DictionaryTagInterface[];
    let args: UpdateDictionaryInterface = { dictionaryId, dictionaryData };

    await this.dictionaryRepo.findOneById(dictionaryId);

    if (newTags) {
      const oldTags = await this.dictionaryRepo.getDictionaryTags(dictionaryId);
      const oldTagIdArr = oldTags.map((item) => item.tagId);
      const newTagIdSet = new Set(newTags);
      const uniqueInNewTags = newTags.filter((item) => !oldTagIdArr.includes(item));

      tagIdToDeleteArr = oldTagIdArr.filter((item) => !newTagIdSet.has(item));
      newTagsArr = uniqueInNewTags.map((tagId) => ({ dictionaryId, tagId }));
      args = { dictionaryId, dictionaryData, tagIdToDeleteArr, newTagsArr };
    }

    return this.dictionaryRepo.updateOneById(args);
  }

  async delete(dictionaryId: number): Promise<number> {
    return this.dictionaryRepo.delete(dictionaryId);
  }
}
