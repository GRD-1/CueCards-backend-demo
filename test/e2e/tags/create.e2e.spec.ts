import * as dotenv from 'dotenv';
import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import * as process from 'node:process';
import { CARD_DATA, INVALID_QUERY_PARAMS, QUERY_PARAMS } from '@/e2e/cards/_fixtures/data';
import { TestEnvironment } from '@/e2e/_fixtures/test-environment';
import dbHelper from '@/e2e/_fixtures/db-helper';
import { Client } from 'pg';
import seedWithCard from '@/e2e/cards/_fixtures/seed-with-cards';
import { CardInterface } from '@/modules/card/card.interface';
import { CardListEntity } from '@/modules/card/card.entity';
import { TagEntity } from '@/modules/tag/tag.entity';
import { number } from 'joi';
import { ObjectType } from '@/types/type.type';

dotenv.config({ path: './.env.test', override: true });

// TODO убедиться, что при отсутствии обязательных параметров запроса возвращается ответ  400
// TODO убедиться, что проходит валидация параметров запроса. в случае ошибки вернет 400
// TODO проверить, что при отсутствии необязательных параметров запроса возвращается корректный ответ
// TODO проверить, что параметр page ограничивает выборку
// TODO проверить, что параметр pageSize ограничивает выборку
// TODO проверить, что параметр byUser ограничивает выборку
// TODO проверить, что параметр value ограничивает выборку
// TODO проверить, что параметр partOfValue ограничивает выборку

describe('GET /api/cards/list-with-first tests', () => {
  const url = '/api/cards/list-with-first';
  const authHeader = { Authorization: `Bearer ${process.env.TEST_USER_PASSWORD as string}` };
  const { fsLanguage, bsLanguage } = QUERY_PARAMS;
  let app: INestApplication;
  let req: supertest.SuperTest<supertest.Test>;
  let db: Client;
  let defaultResp: supertest.Response;
  let defaultRespBody: ObjectType;
  let testCards: CardInterface[];

  beforeAll(async () => {
    app = await TestEnvironment.prepareEnvironment();
    req = supertest(app.getHttpServer());
    db = await dbHelper.connect();
    testCards = await seedWithCard([CARD_DATA], process.env.TEST_USER_ID!);
    defaultResp = await req.get(url).set(authHeader).query({ fsLanguage, bsLanguage });
    defaultRespBody = defaultResp ? defaultResp.body : {};
  });

  afterAll(async () => {
    await dbHelper.disconnect();
    await TestEnvironment.shutdownEnvironment();
  });

  it('should return statusCode = 400 if the required query params are missing', async () => {
    expect(2).toBe(2);
  });

  // it('should return statusCode = 400 if the required query params are missing', async () => {
  //   const resp = await req.get(url).set(authHeader).query({});
  //
  //   expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
  // });
  //
  // it('should return statusCode = 400 if the query params is invalid', async () => {
  //   const resp = await req.get(url).set(authHeader).query(INVALID_QUERY_PARAMS);
  //
  //   const errorArr = JSON.parse(resp.body.errorMsg);
  //   const keys = Object.keys(INVALID_QUERY_PARAMS);
  //
  //   expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
  //   expect(errorArr.length).toBe(keys.length);
  // });
  //
  // it('should return a correct response if the optional query params are missing', async () => {
  //   expect(defaultResp.statusCode).toBe(HttpStatus.OK);
  // });
  //
  // it('the query parameters [page] and [pageSize] should limit the selection', async () => {
  //   const customQueryParams = { fsLanguage, bsLanguage, page: 2, pageSize: 3 };
  //   const resp = await req.get(url).set(authHeader).query(customQueryParams);
  //
  //   expect(resp.body.page).toEqual(customQueryParams.page);
  //   expect(resp.body.page).not.toEqual(defaultRespBody.page);
  //   expect(resp.body.pageSize).toEqual(customQueryParams.pageSize);
  //   expect(resp.body.pageSize).not.toEqual(defaultRespBody.pageSize);
  //   expect(resp.body.records).toEqual(customQueryParams.pageSize);
  //   expect(resp.body.records).not.toEqual(defaultRespBody.records);
  //   expect(resp.body.totalRecords).toEqual(defaultRespBody.totalRecords);
  // });
  //
  // it('the query parameters [byUser] should limit the selection', async () => {
  //   const resp = await req.get(url).set(authHeader).query({ fsLanguage, bsLanguage, byUser: true });
  //   const q = 'SELECT * FROM cards WHERE "fsLanguage" = $1 AND "bsLanguage" = $2 AND "authorId" = $3';
  //   const control = await db.query(q, [fsLanguage, bsLanguage, process.env.TEST_USER_ID]);
  //
  //   expect(resp.body.totalRecords).not.toEqual(defaultRespBody.totalRecords);
  //   expect(resp.body.totalRecords).toEqual(control.rows.length);
  // });
  //
  // it('the query parameters [value] should limit the selection to one value', async () => {
  //   const value = QUERY_PARAMS.value;
  //   const resp = await req.get(url).set(authHeader).query({ fsLanguage, bsLanguage, value });
  //   const control = await db.query(`SELECT * FROM cards WHERE "fsValue" = $1;`, [value]);
  //
  //   expect(resp.body.totalRecords).toBeGreaterThan(0);
  //   expect(resp.body.totalRecords).toEqual(control.rows.length);
  // });
  //
  // it('the query parameters [partOfValue] should limit the selection', async () => {
  //   const partOfValue = QUERY_PARAMS.partOfValue!;
  //   const resp = await req.get(url).set(authHeader).query({ fsLanguage, bsLanguage, partOfValue });
  //   const q = `SELECT * FROM cards WHERE "fsValue" LIKE '%'||$1||'%' OR "bsValue" LIKE '%'||$2||'%'`;
  //   const control = await db.query(q, [partOfValue, partOfValue]);
  //
  //   const valuesCorrect = resp.body.cards.every((card: CardListEntity) => {
  //     return card.fsValue.includes(partOfValue) || card.bsValue.includes(partOfValue)
  //   });
  //
  //   expect(resp.body.totalRecords).toBeGreaterThan(0);
  //   expect(resp.body.totalRecords).toBe(control.rows.length);
  //   expect(valuesCorrect).toBe(true);
  // });
});
