import { CardAndTagsInterface } from '@/modules/card/card.interface';

export const NEW_CARD: CardAndTagsInterface = {
  fsLanguage: 'en',
  fsValue: 'card value en',
  fsDescription: 'new card en',
  fsMeaningVariants: ['meaning 1 en', 'meaning 2 en'],
  fsWrongMeanings: ['wrong meaning 1 en', 'wrong meaning 2 en'],
  fsTranscription: 'transcription',
  fsSynonyms: ['synonym 1 en', 'synonym 2 en'],
  fsAudio: 'path/to/file',
  fsHint: 'hint en',
  bsLanguage: 'ru',
  bsValue: 'card value ru',
  bsDescription: 'new card ru',
  bsMeaningVariants: ['meaning 1 ru', 'meaning 2 ru'],
  bsWrongMeanings: ['wrong meaning 1 ru', 'wrong meaning 2 ru'],
  bsTranscription: 'transcription',
  bsSynonyms: ['synonym 1 ru', 'synonym 2 ru'],
  bsAudio: 'path/to/file',
  bsHint: 'hint ru',
  tags: [1, 3],
};
