import { HttpStatus } from '@nestjs/common';
import { CARD_DATA, INVALID_QUERY_PARAMS, QUERY_PARAMS } from '@/e2e/cards/_fixtures/data.fixture';
import { CardListEntity } from '@/modules/card/card.entity';
import { ObjectType } from '@/_types/types';
import dbHelper from '@/e2e/_fixtures/db-helper';
import supertest from 'supertest';
import { GetCardListRespDto, GetCardListWithFRespDto } from '@/modules/card/card.dto';

export default function getListFixture(url: string): void {
  describe('should check card-list parameters', () => {
    let testCards: ObjectType[];
    let defaultResp: supertest.Response;
    let defaultRespBody: GetCardListRespDto | GetCardListWithFRespDto;
    const { fsLanguage, bsLanguage } = QUERY_PARAMS;

    beforeAll(async () => {
      testCards = await dbHelper.seed('cards', [{ ...CARD_DATA, authorId: global.testUserId }]);
      const queryParams = { fsLanguage, bsLanguage };
      defaultResp = await global.request.get(url).set(global.authHeader).query(queryParams);
      defaultRespBody = defaultResp ? defaultResp.body : {};
    });

    afterAll(async () => {
      const cardIdArr = testCards.map((item) => item.id as number);
      await dbHelper.deleteRecords('cards', cardIdArr);
    });

    it('should return statusCode = 400 if the required query params are missing', async () => {
      const resp = await global.request.get(url).set(global.authHeader).query({});

      expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return statusCode = 400 if the query params are invalid', async () => {
      const resp = await global.request.get(url).set(global.authHeader).query(INVALID_QUERY_PARAMS);

      const errorArr = JSON.parse(resp.body.errorMsg);
      const keys = Object.keys(INVALID_QUERY_PARAMS);

      expect(resp.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(errorArr.length).toBe(keys.length);
    });

    it('should return a correct response if the optional query params are missing', async () => {
      expect(defaultResp.statusCode).toBe(HttpStatus.OK);
    });

    it('the query parameters [page] and [pageSize] should limit the selection', async () => {
      const customQueryParams = { fsLanguage, bsLanguage, page: 2, pageSize: 3 };
      const resp = await global.request.get(url).set(global.authHeader).query(customQueryParams);

      expect(resp.body.page).toEqual(customQueryParams.page);
      expect(resp.body.page).not.toEqual(defaultRespBody.page);
      expect(resp.body.pageSize).toEqual(customQueryParams.pageSize);
      expect(resp.body.pageSize).not.toEqual(defaultRespBody.pageSize);
      expect(resp.body.records).toEqual(customQueryParams.pageSize);
      expect(resp.body.records).toEqual(resp.body.cards.length);
      expect(resp.body.records).not.toEqual(defaultRespBody.records);
      expect(resp.body.totalRecords).toEqual(defaultRespBody.totalRecords);
    });

    it('the query parameters [byUser] should limit the selection', async () => {
      const queryParams = { fsLanguage, bsLanguage, byUser: true };
      const resp = await global.request.get(url).set(global.authHeader).query(queryParams);
      const q = 'SELECT * FROM cards WHERE "fsLanguage" =$1 AND "bsLanguage" =$2 AND "authorId"=$3';
      const control = await global.db.query(q, [fsLanguage, bsLanguage, global.testUserId]);

      expect(resp.body.totalRecords).not.toEqual(defaultRespBody.totalRecords);
      expect(resp.body.totalRecords).toEqual(control.rows.length);
    });

    it('the query parameters [value] should limit the selection to one value', async () => {
      const value = testCards[0].fsValue;
      const queryParams = { fsLanguage, bsLanguage, value };
      const resp = await global.request.get(url).set(global.authHeader).query(queryParams);
      const control = await global.db.query(`SELECT * FROM cards WHERE "fsValue" = $1;`, [value]);

      expect(resp.body.totalRecords).toBeGreaterThan(0);
      expect(resp.body.totalRecords).toEqual(control.rows.length);
    });

    it('the query parameters [partOfValue] should limit the selection', async () => {
      const partOfValue = testCards[0].fsValue as string;
      const queryParams = { fsLanguage, bsLanguage, partOfValue };
      const resp = await global.request.get(url).set(global.authHeader).query(queryParams);
      const q = `SELECT * FROM cards WHERE "fsValue" LIKE '%'||$1||'%' OR "bsValue" LIKE '%'||$2||'%'`;
      const control = await global.db.query(q, [partOfValue, partOfValue]);

      const valuesCorrect = resp.body.cards.every((card: CardListEntity) => {
        return card.fsValue.includes(partOfValue) || card.bsValue.includes(partOfValue);
      });

      expect(resp.body.totalRecords).toBeGreaterThan(0);
      expect(resp.body.totalRecords).toBe(control.rows.length);
      expect(valuesCorrect).toBe(true);
    });

    it('should return the correct card data', async () => {
      const card = defaultRespBody.cards[defaultRespBody.totalRecords - 1];
      expect(card.fsLanguage).toBe(CARD_DATA.fsLanguage);
      expect(card.fsValue).toBe(CARD_DATA.fsValue);
      expect(card.bsLanguage).toBe(CARD_DATA.bsLanguage);
      expect(card.bsValue).toBe(CARD_DATA.bsValue);
    });
  });
}
