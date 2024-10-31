import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.test', override: true });

export default function prepareTestEnvironment(): void {
  const connStr = process.env.POSTGRES_URL;
  execSync(`docker compose -f ./docker/docker-compose.test.yml --env-file .env.test up -d`, { stdio: 'inherit' });
  execSync(`POSTGRES_URL=${connStr} npx prisma migrate reset --force --skip-generate`, { stdio: 'inherit' });
  execSync(`POSTGRES_URL=${connStr} npx @snaplet/seed sync`, { stdio: 'inherit' });
  execSync(`POSTGRES_URL=${connStr} PRISMA_ENV=test npx prisma db seed`, { stdio: 'inherit' });
}

prepareTestEnvironment();
