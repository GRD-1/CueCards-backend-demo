/**
 * ! Executing this script will delete all data in your database
 * documentation is here: https://snaplet-seed.netlify.app/seed/getting-started/overview
 */
import { createSeedClient } from '@snaplet/seed';
import { parseArgs } from 'node:util';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { seedDefault } from './seed.default';

const options: { [key: string]: { type: 'string' } } = {
  environment: { type: 'string' },
};

const main = async (): Promise<void> => {
  const seedClient = await createSeedClient();
  await seedClient.$resetDatabase();
  dotenv.config();

  const {
    values: { environment },
  } = parseArgs({ options });

  switch (environment) {
    case 'development':
      break;
    case 'production':
      break;
    case 'stage':
      break;
    case 'test':
      break;
    default:
      await seedDefault(seedClient);
  }
  process.exit();
};

main();
