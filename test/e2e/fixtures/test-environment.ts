import * as dotenv from 'dotenv';
import { INestApplication } from '@nestjs/common';
import { execSync } from 'child_process';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/prisma/prisma.service';

dotenv.config({ path: './.env.test', override: true });

export class TestEnvironment {
  private static app: INestApplication;

  static async prepareEnvironment(): Promise<INestApplication> {
    process.env.DOTENV_CONFIG_PATH = '.env.test';
    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db push`, { stdio: 'inherit' });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app: INestApplication = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    const prismaService = app.get(PrismaService);
    await prismaService.$connect();
    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx @snaplet/seed sync`, { stdio: 'inherit' });
    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db seed`, { stdio: 'inherit' });
    this.app = app;

    return app;
  }

  static async shutdownEnvironment(): Promise<void> {
    const prismaService = await this.app.get(PrismaService);
    await prismaService.$queryRaw`delete from cards where id=1`;
    await this.app.close();
    console.log('RAVOLY!!!');
    execSync(`docker-compose down`, { stdio: 'inherit' });
  }
}
