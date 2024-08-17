import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  portInternal: process.env.REDIS_PORT_EXTERNAL ? parseInt(process.env.REDIS_PORT_EXTERNAL, 10) : 6379,
  portExternal: process.env.REDIS_PORT_INTERNAL ? parseInt(process.env.REDIS_PORT_INTERNAL, 10) : 6379,
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
}));
