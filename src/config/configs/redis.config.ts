import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST as string,
  portInternal: (process.env.REDIS_PORT_INTERNAL ? parseInt(process.env.REDIS_PORT_INTERNAL, 10) : 6379) as number,
  portExternal: (process.env.REDIS_PORT_EXTERNAL ? parseInt(process.env.REDIS_PORT_EXTERNAL, 10) : 6379) as number,
  url: process.env.REDIS_URL as string,
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
}));
