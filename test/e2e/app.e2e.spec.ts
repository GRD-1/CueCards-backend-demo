import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import * as process from 'node:process';
import { TestEnvironment } from './fixtures/test-environment';

import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.test', override: true });

describe('testing tests', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;

  beforeAll(async () => {
    token = process.env.TEST_USER_PASSWORD as string;

    app = await TestEnvironment.prepareEnvironment();
    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('testing testy test', async () => {
    const { body } = await request
      .get('/api/cards/list?fsLanguage=ru&bsLanguage=en')
      .set('Authorization', `Bearer ${token}`);

    console.log('body = ', body);
    expect(2).toEqual(2);
  });
});
