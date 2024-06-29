export interface CardInterface {
  id?: number;
  authorId: number | null;
  fsLanguage: string;
  fsValue: string;
  fsDescription: string | null;
  fsMeaningVariants: string[];
  fsWrongMeanings: string[];
  fsTranscription: string | null;
  fsSynonyms: string[];
  fsAudio: string | null;
  fsHint: string | null;
  bsLanguage: string;
  bsValue: string;
  bsDescription: string | null;
  bsMeaningVariants: string[];
  bsWrongMeanings: string[];
  bsTranscription: string | null;
  bsSynonyms: string[];
  bsAudio: string | null;
  bsHint: string | null;
}

export interface CreateCardInterface extends CardInterface {
  tags: number[];
}

export interface FindManyCardsInterface {
  page?: number;
  pageSize?: number;
  authorId?: number;
  value?: string;
}

export interface FindManyCardsRespInterface {
  page: number;
  pageSize: number;
  cards: CardInterface[];
}

export interface FindManyCardsFullRespInterface extends FindManyCardsRespInterface {
  totalRecords: number;
}
