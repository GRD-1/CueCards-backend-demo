import { ConnectionOptions } from 'typeorm';
import * as process from 'process';

// const config: ConnectionOptions = {
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: process.env.POSTGRES_PORT_EXTERNAL as number | undefined,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB
// };

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres-db',
  port: process.env.POSTGRES_PORT as number | undefined || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'tododb',
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
