import { TestApp } from '@/e2e/_fixtures/e2e-test-app';
import dbHelper from '@/e2e/_fixtures/db-helper';
import supertest from 'supertest';
import * as dotenv from 'dotenv';
import { userConfig } from '@/config/configs';

dotenv.config({ path: './.env.test', override: true });

beforeAll(async () => {
  const { testUserId, testUserPassword } = userConfig();
  global.testUserId = testUserId;
  global.authHeader = { authorization: `Bearer ${testUserPassword as string}` };
  global.app = await TestApp.init();
  global.request = supertest(global.app.getHttpServer());
  global.db = await dbHelper.connect();
});

afterAll(async () => {
  await dbHelper.disconnect();
  await TestApp.shutdown();
});
