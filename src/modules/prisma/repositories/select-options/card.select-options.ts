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
};

export const CARD_WITH_TAGS_SELECT_OPTIONS = {
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
        select: {
          id: true,
          authorId: true,
          name: true,
        },
      },
    },
  },
};

export const CARD_WITH_SETTINGS_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  fsValue: true,
  bsValue: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          authorId: true,
          name: true,
        },
      },
    },
  },
};

export const CARD_STATISTICS_SELECT_OPTIONS = {
  fsTotalAnswers: true,
  fsCorrectAnswers: true,
  bsTotalAnswers: true,
  bsCorrectAnswers: true,
};
