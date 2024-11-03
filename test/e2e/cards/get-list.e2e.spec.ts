import getListFixture from '@/e2e/cards/_fixtures/get-list.fixture';
import '@/e2e/_fixtures/e2e-before-after';

describe('GET /api/cards/list tests', () => {
  const url = '/api/cards/list';

  getListFixture(url);
});
