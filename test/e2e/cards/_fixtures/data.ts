import { CardAndTagsInterface, CardInterface } from '@/modules/card/card.interface';
import { GetCardListDto } from '@/modules/card/card.dto';

export const CARD_DATA: CardInterface = {
  fsLanguage: 'ru',
  fsValue: 'card value ru',
  fsDescription: 'new card ru',
  fsMeaningVariants: ['meaning 1 ru', 'meaning 2 ru'],
  fsWrongMeanings: ['wrong meaning 1 ru', 'wrong meaning 2 ru'],
  fsTranscription: 'transcription',
  fsSynonyms: ['synonym 1 ru', 'synonym 2 ru'],
  fsAudio: 'path/to/file',
  fsHint: 'hint ru',
  bsLanguage: 'en',
  bsValue: 'card value en',
  bsDescription: 'new card en',
  bsMeaningVariants: ['meaning 1 en', 'meaning 2 en'],
  bsWrongMeanings: ['wrong meaning 1 en', 'wrong meaning 2 en'],
  bsTranscription: 'transcription',
  bsSynonyms: ['synonym 1 en', 'synonym 2 en'],
  bsAudio: 'path/to/file',
  bsHint: 'hint en',
};

export const CREATE_CARD_DATA: CardAndTagsInterface = {
  ...CARD_DATA,
  tags: [1, 3],
};

export const INVALID_CARD_DATA = {
  fsLanguage: null,
  fsValue: null,
  fsDescription: null,
  fsMeaningVariants: null,
  fsWrongMeanings: null,
  fsTranscription: null,
  fsSynonyms: null,
  fsAudio: null,
  fsHint: null,
  bsLanguage: null,
  bsValue: null,
  bsDescription: null,
  bsMeaningVariants: null,
  bsWrongMeanings: null,
  bsTranscription: null,
  bsSynonyms: null,
  bsAudio: null,
  bsHint: null,
  tags: null,
};

export const QUERY_PARAMS: GetCardListDto = {
  fsLanguage: 'ru',
  bsLanguage: 'en',
  page: 2,
  pageSize: 3,
  byUser: false,
  value: CARD_DATA.fsValue,
  partOfValue: CARD_DATA.fsValue.slice(0, 10),
};

export const INVALID_QUERY_PARAMS = {
  fsLanguage: null,
  bsLanguage: null,
  page: null,
  pageSize: null,
};
