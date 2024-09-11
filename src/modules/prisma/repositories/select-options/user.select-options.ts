export const USER_SELECT_OPTIONS = {
  id: true,
  email: true,
  nickname: true,
  avatar: true,
  confirmed: true,
};

export const USER_WITH_CREDENTIALS_SELECT_OPTIONS = {
  id: true,
  email: true,
  nickname: true,
  avatar: true,
  confirmed: true,
  credentials: {
    select: {
      userId: true,
      password: true,
      version: true,
      lastPassword: true,
      updatedAt: true,
    },
  },
};
