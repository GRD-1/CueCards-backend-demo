import { CardEntity } from '@/modules/card/card.entity';

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

export interface CardAndTagsInterface extends CardInterface {
  tags: number[];
}

export interface FindManyCardsInterface {
  page?: number;
  pageSize?: number;
  authorId?: number;
  value?: string;
  partOfValue?: string;
}

export interface FindManyCardsRespInterface {
  page: number;
  pageSize: number;
  cards: CardEntity[];
}

export interface FindManyCardsFullRespInterface extends FindManyCardsRespInterface {
  records: number;
  totalRecords: number;
}

export interface CardTagInterface {
  cardId: number;
  tagId: number;
}

export interface UpdateCardInterface {
  cardId: number;
  cardData: Partial<CardInterface>;
  tagIdToDeleteArr?: number[];
  newTagsArr?: CardTagInterface[];
}

export interface FindManyCardsConditionsInterface {
  authorId?: number;
  OR?: ({ fsValue: { contains: string } | string } | { bsValue: { contains: string } | string })[];
}
