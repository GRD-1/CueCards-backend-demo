import {
  DictionaryWithTagsAndCardsEntity,
  DictionaryWithTagsPrismaEntity,
  DicWithTagsAndCardSettingsEntity,
} from '@/modules/dictionary/dictionary.entity';

export interface DictionaryInterface {
  name: string;
}

export interface DictionaryAndTagsInterface extends DictionaryInterface {
  tags: number[];
}

export interface GetDictListInterface {
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  userId: number;
  name?: string;
  partOfName?: string;
}

export type SearchConditionsArgsType = Omit<GetDictListInterface, 'page' | 'pageSize'>;

export interface GetDictListRespInterface {
  page: number;
  pageSize: number;
  dictionaries: DictionaryWithTagsPrismaEntity[];
}

export interface GetDictListFullRespInterface extends GetDictListRespInterface {
  records: number;
  totalRecords: number;
}

export interface GetListWithFirstRespInterface extends GetDictListFullRespInterface {
  firstDictionary: DictionaryWithTagsAndCardsEntity | null;
}

export interface GetSettingsWithFRespInterface extends GetDictListFullRespInterface {
  firstDictionary: DicWithTagsAndCardSettingsEntity | null;
}

export interface DictionaryTagInterface {
  dictionaryId: number;
  tagId: number;
}

export interface UpdateDictionaryInterface {
  dictionaryId: number;
  dictionaryData: Partial<DictionaryInterface>;
  tagIdToDeleteArr?: number[];
  newTagsArr?: DictionaryTagInterface[];
}

export interface FindManyDictConditionsInterface {
  authorId?: number | { in: number[] };
  name?: { contains: string } | string;
}
