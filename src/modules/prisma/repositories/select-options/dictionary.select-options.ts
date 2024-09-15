import { TAG_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/tag.select-options';

export const DICTIONARY_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  name: true,
  tags: {
    select: {
      tag: {
        select: TAG_SELECT_OPTIONS,
      },
    },
  },
};
