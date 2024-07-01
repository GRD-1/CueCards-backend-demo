import { TagEntity } from '@/modules/tag/tag.entity';

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
  records: number;
  totalRecords: number;
}
