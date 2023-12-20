import { ConnectionOptions } from 'typeorm';
import * as process from 'process';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT_INTERNAL as number | undefined,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // entities: [`${__dirname}/**/*.entity.ts`, `${__dirname}/**/*.entity.js`],
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migration',
  migrations: [`${__dirname}/migration/**/*.ts`, `${__dirname}/migration/**/*.js`],
  synchronize: false
  // cli: {
  //   migrationsDir: 'src/migration'
  // }
};

export default config;
