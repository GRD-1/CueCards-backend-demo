import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER_CONFIG } from './config/logger.config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: [...LOGGER_CONFIG]
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
