import { registerAs } from '@nestjs/config';
import { AppLogLevel } from '@/config/config.interfaces';
import * as process from 'node:process';

export const appConfig = registerAs('app', () => ({
  id: process.env.APP_ID as string,
  name: process.env.APP_NAME as string,
  host: process.env.APP_HOST as string,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  domain: process.env.APP_DOMAIN as string,
  logLevel: process.env.APP_LOG_LEVEL || AppLogLevel.Log,
  composeName: process.env.COMPOSE_PROJECT_NAME as string,
  apiPort: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 4000,
}));
