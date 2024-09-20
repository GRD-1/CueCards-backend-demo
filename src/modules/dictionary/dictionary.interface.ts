import {
  DictionaryWithTagsAndCardsEntity,
  DictionaryWithTagsPrismaEntity,
  DicWithTagsAndCardSettingsEntity,
} from '@/modules/dictionary/dictionary.entity';

export interface IDictionary {
  fsName: string;
  bsName: string;
  fsLanguage: string;
  bsLanguage: string;
}

export interface IDictionaryAndTags extends IDictionary {
  tags: number[];
}

export interface IGetDictList {
  userId: string;
  fsLanguage: string;
  bsLanguage: string;
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  name?: string;
  partOfName?: string;
}

export type SearchConditionsArgsType = Omit<IGetDictList, 'page' | 'pageSize'>;

export interface IGetDictListResp {
  page: number;
  pageSize: number;
  dictionaries: DictionaryWithTagsPrismaEntity[];
}

export interface IGetDictListFullResp extends IGetDictListResp {
  records: number;
  totalRecords: number;
}

export interface IGetListWithFirstResp extends IGetDictListFullResp {
  firstDictionary: DictionaryWithTagsAndCardsEntity | null;
}

export interface IGetSettingsWithFResp extends IGetDictListFullResp {
  firstDictionary: DicWithTagsAndCardSettingsEntity | null;
}

export interface IDictionaryTag {
  dictionaryId: number;
  tagId: number;
}

export interface IUpdateDictionary {
  dictionaryId: number;
  dictionaryData: Partial<IDictionary>;
  tagIdToDeleteArr?: number[];
  newTagsArr?: IDictionaryTag[];
}

export interface IFindManyDictConditions {
  authorId?: string | { in: string[] };
  OR?: ({ fsName: { contains: string } | string } | { bsName: { contains: string } | string })[];
  fsLanguage: string;
  bsLanguage: string;
}
