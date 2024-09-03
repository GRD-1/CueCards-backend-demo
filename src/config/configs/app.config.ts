import { registerAs } from '@nestjs/config';
import { AppLogLevel } from '@/config/config.interfaces';
import * as process from 'node:process';

export const appConfig = registerAs('app', () => ({
  id: process.env.APP_ID,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  domain: process.env.APP_DOMAIN,
  logLevel: process.env.APP_LOG_LEVEL || AppLogLevel.Log,
  composeName: process.env.COMPOSE_PROJECT_NAME,
  apiPort: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 4000,
  defaultUserId: process.env.APP_DEFAULT_USER || '00000000-0000-0000-0000-000000000000',
}));
