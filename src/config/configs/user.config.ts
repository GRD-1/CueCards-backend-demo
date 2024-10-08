import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const userConfig = registerAs('user', () => ({
  defaultUserId: process.env.DEFAULT_USER_ID as string,
  defaultUserEmail: process.env.DEFAULT_USER_EMAIL as string,
  defaultUserNickname: process.env.DEFAULT_USER_NICKNAME as string,
  defaultUserAvatar: process.env.DEFAULT_USER_AVATAR as string,
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD as string,
  testUserId: process.env.TEST_USER_ID as string,
  testUserEmail: process.env.TEST_USER_EMAIL as string,
  testUserNickname: process.env.TEST_USER_NICKNAME as string,
  testUserAvatar: process.env.TEST_USER_AVATAR as string,
  testUserPassword: process.env.TEST_USER_PASSWORD as string,
  testUserJti: process.env.TEST_USER_JTI as string,
}));
