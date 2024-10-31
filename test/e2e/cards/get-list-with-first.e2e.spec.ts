import * as process from 'node:process';
import checkQueryParams from '@/e2e/cards/_fixtures/check-query-params';

describe('GET /api/cards/list-with-first tests', () => {
  const url = '/api/cards/list-with-first';
  const authHeader = { authorization: `Bearer ${process.env.TEST_USER_PASSWORD as string}` };

  checkQueryParams(authHeader, url);
});
