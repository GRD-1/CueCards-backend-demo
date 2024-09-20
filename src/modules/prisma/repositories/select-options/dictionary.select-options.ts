import { TAG_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/tag.select-options';

export const DICTIONARY_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  fsName: true,
  bsName: true,
  fsLanguage: true,
  bsLanguage: true,
  tags: {
    select: {
      tag: {
        select: TAG_SELECT_OPTIONS,
      },
    },
  },
};
