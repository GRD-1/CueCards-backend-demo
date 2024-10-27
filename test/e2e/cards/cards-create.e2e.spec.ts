import * as dotenv from 'dotenv';
import { INestApplication, Response } from '@nestjs/common';
import supertest from 'supertest';
import * as process from 'node:process';
import { NEW_CARD } from '@/e2e/cards/fixtures';
import { TestEnvironment } from '@/e2e/fixtures/test-environment';

dotenv.config({ path: './.env.test', override: true });

// TODO проверить id автора
// TODO проверить, что структура ответа совпадает со структурой контракта
// TODO проверить, что сохраненные данные совпадают с тем, что сохраняли
// TODO убедиться, что проходит валидация данных на вход. в случае ошибки вернет 400
// TODO проверку уникальности значения (fsValue, bsValue). В случае ошибки должен вернуть 422

describe('POST /api/cards/create tests', () => {
  const url = '/api/cards/create';
  const authHeader = { Authorization: `Bearer ${process.env.TEST_USER_PASSWORD as string}` };
  const authorId = process.env.TEST_USER_ID;
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let result: { [key: string]: any };

  beforeAll(async () => {
    app = await TestEnvironment.prepareEnvironment();
    request = supertest(app.getHttpServer());
    const response = await request.post(url).set(authHeader).send(NEW_CARD);
    result = response ? response.body : null;
  });

  afterAll(async () => {
    await TestEnvironment.shutdownEnvironment();
  });

  it('should set a correct authorId', async () => {
    const { body } = await request.post(url).set(authHeader).send(NEW_CARD);
    const newCard = body.id ? await request.get(`/api/cards/${body.id}/get-one`).set(authHeader) : undefined;

    console.log('body = ', body);
    console.log('newCard.body = ', newCard?.body);

    expect(+body.id).toBe(15);
    // expect(newCard?.body).toEqual(NEW_CARD);
  });

  // it('should create a card with the valid parameters', async () => {
  //   expect(result).not.toBeNull();
  //   expect(+result.id).toBe(15);
  // });
});
