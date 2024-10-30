import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from '@/filters/global-exception.filter';
import dbHelper from '@/e2e/_fixtures/db-helper';

export class TestEnvironment {
  private static app: INestApplication;

  static async prepareEnvironment(): Promise<INestApplication> {
    try {
      await dbHelper.prepare();

      if (!this.app) {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
        this.app = moduleFixture.createNestApplication();

        const configService = this.app.get(ConfigService);
        const appConf = configService.get('app');

        this.app.setGlobalPrefix('api');
        this.app.useLogger([appConf.logLevel]);
        this.app.useGlobalPipes(
          new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: {
              enableImplicitConversion: true,
            },
            exceptionFactory: (validationErrors = []): BadRequestException => {
              const errors = validationErrors.map((error) => ({
                property: error.property,
                constraints: Object.values(error.constraints || {}),
              }));

              return new BadRequestException(JSON.stringify(errors));
            },
          }),
        );
        this.app.useGlobalFilters(new GlobalExceptionFilter());

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
