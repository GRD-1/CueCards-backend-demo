import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { validateEnvVariables } from '@/config/config.validation';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

dotenv.config();
const validatedConfig = validateEnvVariables(process.env);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: [validatedConfig.LOG_LEVEL]
  });
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('CueCards API')
    .setDescription('An application for learning proverbs in a foreign language')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(validatedConfig.APP_PORT);
}
bootstrap();
