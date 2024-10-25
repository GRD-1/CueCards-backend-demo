import * as dotenv from 'dotenv';
import { INestApplication } from '@nestjs/common';
import { execSync } from 'child_process';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Client } from 'pg';

dotenv.config({ path: './.env.test', override: true });

export class TestEnvironment {
  private static app: INestApplication;

  static async prepareEnvironment(): Promise<INestApplication> {
    try {
      const client = new Client(process.env.POSTGRES_URL);
      await client.connect();
      await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
      await client.query('CREATE SCHEMA public;');
      await client.end();

      execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db push --accept-data-loss`, { stdio: 'inherit' });
      execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx @snaplet/seed sync`, { stdio: 'inherit' });
      execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db seed`, { stdio: 'inherit' });

      if (!this.app) {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
        this.app = moduleFixture.createNestApplication();
        this.app.setGlobalPrefix('api');
        await this.app.init();
      }

      return this.app;
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }

  static async shutdownEnvironment(): Promise<void> {
    await this.app.close();
  }
}
