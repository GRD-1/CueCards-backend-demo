/**
 * ! Executing this script will delete all data in your database
 * documentation is here: https://snaplet-seed.netlify.app/seed/getting-started/overview
 */
import { createSeedClient } from '@snaplet/seed';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { seedDefaultMode } from './seed.default-mode';
import { seedTestMode } from './seed.test-mode';

const main = async (): Promise<void> => {
  const seedClient = await createSeedClient();
  await seedClient.$resetDatabase();
  dotenv.config();

  const environment = process.env.PRISMA_ENV;

  switch (environment) {
    case 'test':
      await seedTestMode(seedClient);
      break;
    default:
      await seedDefaultMode(seedClient);
  }
  process.exit();
};

main();
