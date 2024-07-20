import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

export interface DictionaryInterface {
  name: string;
}

export interface DictionaryAndTagsInterface extends DictionaryInterface {
  tags: number[];
}

export interface FindManyDictInterface {
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  authorId: number;
  name?: string;
  partOfName?: string;
}

export type SearchConditionsArgsType = Omit<FindManyDictInterface, 'page' | 'pageSize'>;

export interface FindManyDictRespInterface {
  page: number;
  pageSize: number;
  dictionaries: DictionaryEntity[];
}

export interface FindManyFullRespInterface extends FindManyDictRespInterface {
  records: number;
  totalRecords: number;
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
