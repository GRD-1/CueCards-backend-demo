import { TagEntity } from '@/modules/tag/tag.entity';

export interface TagInterface {
  name: string;
}

export interface FindManyTagsInterface {
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  authorId: number;
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
  authorId?: number | { in: number[] };
  name?: { contains: string } | string;
}
