import { registerAs } from '@nestjs/config';

export const postgresConfig = registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST as string,
  portInternal: (process.env.POSTGRES_PORT_EXTERNAL
    ? parseInt(process.env.POSTGRES_PORT_EXTERNAL, 10)
    : 5432) as number,
  portExternal: (process.env.POSTGRES_PORT_INTERNAL
    ? parseInt(process.env.POSTGRES_PORT_INTERNAL, 10)
    : 5432) as number,
  db: process.env.POSTGRES_DB as string,
  user: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  url: process.env.POSTGRES_URL as string,
}));
