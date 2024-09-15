import { CardListEntity, CardWitTagsEntity } from '@/modules/card/card.entity';

export interface CardInterface {
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

export interface GetCardListInterface {
  userId: string;
  fsLanguage: string;
  bsLanguage: string;
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  value?: string;
  partOfValue?: string;
}

export type SearchConditionsArgsType = Omit<GetCardListInterface, 'page' | 'pageSize'>;

export interface GetCardListRespInterface {
  page: number;
  pageSize: number;
  cards: CardListEntity[];
}

export interface GetCardListFullRespInterface extends GetCardListRespInterface {
  records: number;
  totalRecords: number;
}

export interface GetListWithFirstRespInterface extends GetCardListRespInterface {
  records: number;
  totalRecords: number;
  firstCard: CardWitTagsEntity | null;
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

export interface GetCardListConditionsInterface {
  authorId?: string | { in: string[] };
  OR?: ({ fsValue: { contains: string } | string } | { bsValue: { contains: string } | string })[];
  fsLanguage: string;
  bsLanguage: string;
}
