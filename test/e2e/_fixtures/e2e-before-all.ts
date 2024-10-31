import { TestApp } from '@/e2e/_fixtures/e2e-test-app';
import dbHelper from '@/e2e/_fixtures/db-helper';
import supertest from 'supertest';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.test', override: true });

beforeAll(async () => {
  global.app = await TestApp.init();
  global.request = supertest(global.app.getHttpServer());
  global.db = await dbHelper.connect();
});

afterAll(async () => {
  await dbHelper.disconnect();
  await TestApp.shutdown();
});
