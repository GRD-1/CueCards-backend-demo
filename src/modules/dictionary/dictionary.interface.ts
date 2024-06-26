export interface DictionaryInterface {
  id?: number;
  authorId: number | null;
  title: string;
  tags: string[];
}

export interface FindManyArgsInterface {
  page?: number;
  pageSize?: number;
  authorId?: number;
  title?: string;
}

export interface FindManyRespInterface {
  page: number;
  pageSize: number;
  dictionaries: DictionaryInterface[];
}

export interface FindManyFullRespInterface extends FindManyRespInterface {
  totalRecords: number;
}
