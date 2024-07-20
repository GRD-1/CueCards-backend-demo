import { CardEntity, CardWithSettingsEntity } from '@/modules/card/card.entity';

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

export interface FindManyCardsInterface {
  page?: number;
  pageSize?: number;
  byUser?: boolean;
  authorId: number;
  value?: string;
  partOfValue?: string;
  withoutHidden?: boolean;
}

export type SearchConditionsArgsType = Omit<FindManyCardsInterface, 'page' | 'pageSize'>;

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
  authorId?: number | { in: number[] };
  OR?: ({ fsValue: { contains: string } | string } | { bsValue: { contains: string } | string })[];
  cardIsHidden?: {
    none: {
      userId: number | { in: number[] };
    };
  };
}

export interface GetSettingsRespInterface {
  page: number;
  pageSize: number;
  cards: CardWithSettingsEntity[];
}

export interface GetSettingsFullRespInterface extends GetSettingsRespInterface {
  records: number;
  totalRecords: number;
}
