import getListFixture from '@/e2e/cards/_fixtures/get-list.fixture';
import { CARD_DATA_2, QUERY_PARAMS } from '@/e2e/cards/_fixtures/data.fixture';
import { ObjectType } from '@/_types/types';
import dbHelper from '@/e2e/_fixtures/db-helper';
import '@/e2e/_fixtures/e2e-before-after';

describe('GET /api/cards/list-with-first tests', () => {
  const url = '/api/cards/list-with-first';
  let testCards: ObjectType[];
  let fsLanguage = CARD_DATA_2.fsLanguage;
  let bsLanguage = CARD_DATA_2.bsLanguage;

  beforeAll(async () => {
    testCards = await dbHelper.seed('cards', [{ ...CARD_DATA_2, authorId: global.testUserId }]);
  });

  afterAll(async () => {
    const cardIdArr = testCards.map((item) => item.id as number);
    await dbHelper.deleteRecords('cards', cardIdArr);
  });

  getListFixture(url);

  it('should return the correct first card data', async () => {
    let queryParamsOne: typeof QUERY_PARAMS = { fsLanguage, bsLanguage };
    const respOne = await global.request.get(url).set(global.authHeader).query(queryParamsOne);
    let queryParamsTwo = { fsLanguage, bsLanguage, pageSize: 1, page: respOne.body.totalRecords };
    const respTwo = await global.request.get(url).set(global.authHeader).query(queryParamsTwo);

    const firstCard = respTwo.body.firstCard;
    const { id, authorId, createdAt, updatedAt, deleteMark, tags, ...withoutDefault } = firstCard;

    expect(respOne.body.firstCard.id).toEqual(respOne.body.cards[0].id);
    expect(respTwo.body.firstCard.id).toEqual(respTwo.body.cards[0].id);
    expect(withoutDefault).toEqual(CARD_DATA_2);
  });
});
