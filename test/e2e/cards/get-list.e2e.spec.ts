import getListFixture from '@/e2e/cards/_fixtures/get-list.fixture';

describe('GET /api/cards/list tests', () => {
  const url = '/api/cards/list';

  getListFixture(url);
});
