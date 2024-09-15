import { TagEntity } from '@/modules/tag/tag.entity';

export interface TagInterface {
  authorId: string;
  name: string;
  fsLanguage: string;
  bsLanguage: string;
}

export interface FindManyTagsInterface {
  authorId: string;
  fsLanguage: string;
  bsLanguage: string;
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  name?: string;
  partOfName?: string;
}

export type SearchConditionsArgsType = Omit<FindManyTagsInterface, 'page' | 'pageSize'>;

export interface FindManyTagsRespInterface {
  page: number;
  pageSize: number;
  tags: TagEntity[];
}

export interface FindManyTagsFullRespInterface extends FindManyTagsRespInterface {
  records: number;
  totalRecords: number;
}

export interface FindManyTagsConditionsInterface {
  authorId?: string | { in: string[] };
  name?: { contains: string } | string;
  fsLanguage: string;
  bsLanguage: string;
}
