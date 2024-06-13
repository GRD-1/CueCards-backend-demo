import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import config from '@/config/config.service';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: [config.LOG_LEVEL],
  });
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const params = new DocumentBuilder()
    .setTitle('CueCards API')
    .setDescription('An application for learning proverbs in a foreign language')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, params);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.APP_PORT);
}
bootstrap();
