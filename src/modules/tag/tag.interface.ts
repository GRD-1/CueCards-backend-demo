import { TagEntity } from '@/modules/tag/tag.entity';

export interface ITag {
  authorId: string;
  fsValue: string;
  bsValue: string;
  fsLanguage: string;
  bsLanguage: string;
}

export interface ITagWithId extends Partial<ITag> {
  tagId: number;
  authorId: string;
}

export interface IFindManyTags {
  authorId: string;
  fsLanguage: string;
  bsLanguage: string;
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  value?: string;
  partOfValue?: string;
}

export type ISearchConditionsArgs = Omit<IFindManyTags, 'page' | 'pageSize'>;

export interface IFindManyTagsResp {
  page: number;
  pageSize: number;
  tags: TagEntity[];
}

export interface IFindManyTagsFullResp extends IFindManyTagsResp {
  records: number;
  totalRecords: number;
}

export interface IFindManyTagsConditions {
  authorId?: string | { in: string[] };
  value?: { contains: string } | string;
  fsLanguage: string;
  bsLanguage: string;
}
