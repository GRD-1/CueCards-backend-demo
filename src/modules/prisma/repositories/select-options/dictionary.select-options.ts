export const DICTIONARY_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  name: true,
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
