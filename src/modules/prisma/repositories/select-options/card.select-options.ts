import { TAG_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/tag.select-options';

export const CARD_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  fsLanguage: true,
  fsValue: true,
  fsDescription: true,
  fsMeaningVariants: true,
  fsWrongMeanings: true,
  fsTranscription: true,
  fsSynonyms: true,
  fsAudio: true,
  fsHint: true,
  bsLanguage: true,
  bsValue: true,
  bsDescription: true,
  bsMeaningVariants: true,
  bsWrongMeanings: true,
  bsTranscription: true,
  bsSynonyms: true,
  bsAudio: true,
  bsHint: true,
  createdAt: true,
  updatedAt: true,
  deleteMark: true,
  tags: {
    select: {
      tag: {
        select: TAG_SELECT_OPTIONS,
      },
    },
  },
};

export const CARD_LIST_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  fsLanguage: true,
  fsValue: true,
  bsLanguage: true,
  bsValue: true,
  tags: {
    select: {
      tag: {
        select: TAG_SELECT_OPTIONS,
      },
    },
  },
};
