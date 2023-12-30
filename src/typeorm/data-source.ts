import 'reflect-metadata';
import * as process from 'process';
import { ConnectionOptions, DataSource } from 'typeorm';

export const PostgresConnectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT_INTERNAL as number | undefined,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migration',
  migrations: [`${__dirname}/migration/**/*{.ts,.js}`],
  synchronize: false
};

export default new DataSource(PostgresConnectionOptions);
