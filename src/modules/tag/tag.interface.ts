import { TagEntity } from '@/modules/tag/tag.entity';

export interface TagInterface {
  id?: number;
  authorId: number | null;
  name: string;
}

export interface FindManyTagsInterface {
  page?: number;
  pageSize?: number;
  authorId?: number;
  name?: string;
}

export interface FindManyTagsRespInterface {
  page: number;
  pageSize: number;
  tags: TagEntity[];
}

export interface FindManyTagsFullRespInterface extends FindManyTagsRespInterface {
  totalRecords: number;
}
