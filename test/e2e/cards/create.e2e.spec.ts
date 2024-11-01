import { HttpStatus } from '@nestjs/common';
import supertest from 'supertest';
import * as process from 'node:process';
import { CREATE_CARD_DATA, INVALID_CARD_DATA } from '@/e2e/cards/_fixtures/data.fixture';
import { QueryResult } from 'pg';
import { ObjectType } from '@/_types/types';
import dbHelper from '@/e2e/_fixtures/db-helper';

describe('POST /api/cards/create tests', () => {
  const url = '/api/cards/create';
  let defaultResp: supertest.Response;
  let defaultRespBody: ObjectType;
  let control: QueryResult;
  let controlBody: ObjectType;

  beforeAll(async () => {
    defaultResp = await global.request.post(url).set(global.authHeader).send(CREATE_CARD_DATA);
    defaultRespBody = defaultResp ? defaultResp.body : {};
    control = await global.db.query(`SELECT * FROM cards WHERE id = ${defaultRespBody.id}`);
    controlBody = control ? control.rows[0] : {};
  });

  afterAll(async () => {
    await dbHelper.deleteRecords('cards', [defaultResp.body.id]);
  });

  it('should return statusCode = 422, when fsValue or bsValue is not unique', async () => {
    const dataSetOne = { ...CREATE_CARD_DATA, fsValue: 'new fsValue' };
    const dataSetTwo = { ...CREATE_CARD_DATA, bsValue: 'new bsValue' };
    const resultOne = await global.request.post(url).set(global.authHeader).send(dataSetOne);
    const resultTwo = await global.request.post(url).set(global.authHeader).send(dataSetTwo);

    expect(resultOne.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(resultTwo.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should return statusCode = 400, when the data type is invalid', async () => {
    const resp = await global.request.post(url).set(global.authHeader).send(INVALID_CARD_DATA);

    const errorArr = JSON.parse(resp.body.errorMsg);
    const keys = Object.keys(INVALID_CARD_DATA);

    expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(errorArr.length).toBe(keys.length);
  });

  it('should set a correct authorId', async () => {
    const authorId = controlBody.authorId;

    expect(authorId).toBe(process.env.TEST_USER_ID);
  });

  it('should create a card with the valid parameters', async () => {
    const { tags, ...cardDataWithoutTags } = CREATE_CARD_DATA;
    const { id, authorId, createdAt, updatedAt, deleteMark, ...recordWithoutDefault } = controlBody;

    expect(recordWithoutDefault).toEqual(cardDataWithoutTags);
  });

  it('should create linked records in the card_tags table', async () => {
    const q = `SELECT * FROM card_tags WHERE "cardId" = ${defaultRespBody.id}`;
    const resp = await global.db.query(q);
    const linkedTags = resp.rows.map((item) => item.tagId);

    expect(linkedTags).toEqual(CREATE_CARD_DATA.tags);
  });
});
