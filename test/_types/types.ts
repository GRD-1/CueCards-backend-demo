import supertest from 'supertest';

export type ObjectType = { [key: string]: unknown };

export type AuthHeaderType = { authorization: string };

export type TestReqType = supertest.SuperTest<supertest.Test>;

export type TestRespType = supertest.Response;
