import { Injectable } from '@nestjs/common';
import {
  IDictionaryAndTags,
  IDictionaryTag,
  IGetDictList,
  IGetDictListFullResp,
  IGetListWithFirstResp,
  IGetSettingsWithFResp,
  IUpdateDictionary,
} from '@/modules/dictionary/dictionary.interface';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import {
  DictionaryWithTagsAndCardsEntity,
  DicWithTagsAndCardSettingsEntity,
} from '@/modules/dictionary/dictionary.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { ACCESS_VIOLATION_ERR_MSG, UNIQUE_VIOLATION_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepo: DictionaryRepo) {}

  async create(payload: IDictionaryAndTags, userId: string): Promise<number> {
    const existingDictionaryId = await this.dictionaryRepo.getIdByName(payload.fsName, payload.bsName);
    if (existingDictionaryId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, UNIQUE_VIOLATION_ERR_MSG);
    }

    return this.dictionaryRepo.create(payload, userId);
  }

  async getList(args: IGetDictList): Promise<IGetDictListFullResp> {
    const [{ page, pageSize, dictionaries }, totalRecords] = await Promise.all([
      this.dictionaryRepo.getList(args),
      this.dictionaryRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: dictionaries.length, totalRecords, dictionaries };
  }

  async getListWithFirst(args: IGetDictList): Promise<IGetListWithFirstResp> {
    let firstDictionary: DictionaryWithTagsAndCardsEntity | null = null;

    const list = await this.getList(args);

    if (list.dictionaries.length) {
      firstDictionary = await this.findOneById(list.dictionaries[0].id);
    }

    return { ...list, firstDictionary };
  }

  async getCustomizedWithFirst(args: IGetDictList): Promise<IGetListWithFirstResp> {
    let firstDictionary: DictionaryWithTagsAndCardsEntity | null = null;

    const list = await this.getList(args);

    if (list.dictionaries.length) {
      firstDictionary = await this.getCustomizedDictionary(list.dictionaries[0].id, args.userId);
    }

    return { ...list, firstDictionary };
  }

  async getSettingsWithFirst(args: IGetDictList): Promise<IGetSettingsWithFResp> {
    let firstDictionary: DicWithTagsAndCardSettingsEntity | null = null;

    const list = await this.getList(args);

    if (list.dictionaries.length) {
      firstDictionary = await this.getDictionaryWithSettings(list.dictionaries[0].id, args.userId);
    }

    return { ...list, firstDictionary };
  }

  async getCustomizedDictionary(dictionaryId: number, userId: string): Promise<DictionaryWithTagsAndCardsEntity> {
    return this.dictionaryRepo.getCustomizedDictionary(dictionaryId, userId);
  }

  async getDictionaryWithSettings(dictionaryId: number, userId: string): Promise<DicWithTagsAndCardSettingsEntity> {
    return this.dictionaryRepo.getDictionaryWithSettings(dictionaryId, userId);
  }

  async findOneById(dictionaryId: number): Promise<DictionaryWithTagsAndCardsEntity> {
    return this.dictionaryRepo.findOneById(dictionaryId);
  }

  async updateOneById(dictId: number, payload: Partial<IDictionaryAndTags>, userId: string): Promise<number> {
    const { tags: newTags, ...dictionaryData } = payload;
    let tagIdToDeleteArr: number[];
    let newTagsArr: IDictionaryTag[];
    let args: IUpdateDictionary = { dictionaryId: dictId, dictionaryData };

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

  async delete(dictionaryId: number, userId: string): Promise<number> {
    await this.checkEditingRights(dictionaryId, userId);

    return this.dictionaryRepo.delete(dictionaryId);
  }

  async checkEditingRights(dictionaryId: number, userId: string): Promise<void> {
    const dictionary = await this.dictionaryRepo.findOneById(dictionaryId);
    if (dictionary.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, ACCESS_VIOLATION_ERR_MSG);
    }
  }
}
