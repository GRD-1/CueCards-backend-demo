import { registerAs } from '@nestjs/config';

export const postgresConfig = registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST,
  portInternal: process.env.POSTGRES_PORT_EXTERNAL ? parseInt(process.env.POSTGRES_PORT_EXTERNAL, 10) : 5432,
  portExternal: process.env.POSTGRES_PORT_INTERNAL ? parseInt(process.env.POSTGRES_PORT_INTERNAL, 10) : 5432,
  db: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  url: process.env.POSTGRES_URL,
}));
