import * as dotenv from 'dotenv';
import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import * as process from 'node:process';
import { CARD_DATA, INVALID_CARD_DATA } from '@/e2e/cards/fixtures/data';
import { TestEnvironment } from '@/e2e/fixtures/test-environment';
import dbHelper from '@/e2e/fixtures/db-helper';
import { Client } from 'pg';
import { ObjectType } from '@/e2e/interfaces';

dotenv.config({ path: './.env.test', override: true });

describe('POST /api/cards/create tests', () => {
  const url = '/api/cards/create';
  const authHeader = { Authorization: `Bearer ${process.env.TEST_USER_PASSWORD as string}` };
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let db: Client;
  let response: ObjectType;
  let newRecord: ObjectType;

  beforeAll(async () => {
    app = await TestEnvironment.prepareEnvironment();
    request = supertest(app.getHttpServer());
    db = await dbHelper.connect();

    const resp = await request.post(url).set(authHeader).send(CARD_DATA);
    response = resp ? resp.body : {};
    const rec = await db.query(`SELECT * FROM cards WHERE id = ${response.id}`);
    newRecord = rec ? rec.rows[0] : {};
  });

  afterAll(async () => {
    await dbHelper.disconnect();
    await TestEnvironment.shutdownEnvironment();
  });

  it('should return statusCode = 422, when fsValue or bsValue is not unique', async () => {
    const dataSetOne = { ...CARD_DATA, fsValue: 'new fsValue' };
    const dataSetTwo = { ...CARD_DATA, bsValue: 'new bsValue' };
    const resultOne = await request.post(url).set(authHeader).send(dataSetOne);
    const resultTwo = await request.post(url).set(authHeader).send(dataSetTwo);

    expect(resultOne.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(resultTwo.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should return statusCode = 400, when the data type is invalid', async () => {
    const resp = await request.post(url).set(authHeader).send(INVALID_CARD_DATA);

    const errorArr = JSON.parse(resp.body.errorMsg);
    const keys = Object.keys(INVALID_CARD_DATA);

    expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(errorArr.length).toBe(keys.length);
  });

  it('should set a correct authorId', async () => {
    const authorId = newRecord.authorId;

    expect(authorId).toBe(process.env.TEST_USER_ID);
  });

  it('should create a card with the valid parameters', async () => {
    const { tags, ...cardDataWithoutTags } = CARD_DATA;
    const { id, authorId, createdAt, updatedAt, deleteMark, ...newRecordWithoutDefaultParams } = newRecord;

    expect(newRecordWithoutDefaultParams).toEqual(cardDataWithoutTags);
  });

  it('should create linked records in the card_tags table', async () => {
    const resp = await db.query(`SELECT * FROM card_tags WHERE "cardId" = ${response.id}`);
    const linkedTags = resp.rows.map((item) => item.tagId);

    expect(linkedTags).toEqual(CARD_DATA.tags);
  });
});
