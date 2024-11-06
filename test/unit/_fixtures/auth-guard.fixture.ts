import { ConfigType } from '@nestjs/config';
import { appConfig, jwtConfig, nodeConfig, userConfig } from '@/config/configs';
import { ExecutionContext } from '@nestjs/common';
import { RequestInterface } from '@/types/request.type';

interface MockRequest extends RequestInterface {
  headers: {
    authorization?: string;
  };
}

export const nodeConfMock = {
  mode: 'development',
} as ConfigType<typeof nodeConfig>;

export const appConfMock = {
  id: 'app-id',
} as ConfigType<typeof appConfig>;

export const userConfMock = {
  defaultUserPassword: 'defaultPassword',
  testUserPassword: 'testPassword',
  defaultUserId: 'defaultUserId',
  testUserId: 'testUserId',
} as ConfigType<typeof userConfig>;

export const jwtConfMock = {
  access: { time: 3600 },
} as ConfigType<typeof jwtConfig>;

export const requestMock = {
  headers: {},
} as MockRequest;

export const contextMock = {
  switchToHttp: () => ({
    getRequest: () => requestMock,
  }),
} as unknown as ExecutionContext;

export const mockTokenPayload = {
  sub: 'user-id',
  jti: 'jti',
  exp: 3600,
};
