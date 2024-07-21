import { LanguageEntity } from '@/modules/language/language.entity';

export interface LanguageInterface {
  name: string;
  acronym: string;
}

export interface FindManyLanguagesInterface {
  page?: number;
  pageSize?: number;
  name?: string;
  partOfName?: string;
}

export type SearchConditionsArgsType = Omit<FindManyLanguagesInterface, 'page' | 'pageSize'>;

export interface FindManyLanguagesRespInterface {
  page: number;
  pageSize: number;
  languages: LanguageEntity[];
}

export interface FindManyLangFullRespInterface extends FindManyLanguagesRespInterface {
  records: number;
  totalRecords: number;
}

export interface FindManyLangConditionsInterface {
  authorId?: number | { in: number[] };
  name?: { contains: string } | string;
}
