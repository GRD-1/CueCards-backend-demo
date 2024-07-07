import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

export interface DictionaryInterface {
  id?: number;
  authorId: number | null;
  name: string;
}

export interface DictionaryAndTagsInterface extends DictionaryInterface {
  tags: number[];
}

export interface FindManyDictInterface {
  page?: number;
  pageSize?: number;
  authorId?: number;
  name?: string;
  partOfName?: string;
}

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

export interface WhereConditionsInterface {
  authorId?: number;
  name?: { contains: string } | string;
}
