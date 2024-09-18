import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { AppLogLevel } from '@/config/config.interfaces';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const httpsOptions = {
    key: readFileSync('certificates/private-key.pem'),
    cert: readFileSync('certificates/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);
  const appLogLevel = configService.get<AppLogLevel>('APP_LOG_LEVEL');
  const appPort = configService.get<number>('APP_PORT');

  app.enableCors({ origin: true });
  app.useLogger([appLogLevel!]);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []): BadRequestException => {
        const errors = validationErrors.map((error) => {
          return {
            property: error.property,
            constraints: Object.values(error.constraints || {}),
          };
        });

        return new BadRequestException(JSON.stringify(errors));
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const params = new DocumentBuilder()
    .setTitle('CueCards API')
    .setDescription('An application for learning proverbs in a foreign language')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, params);
  SwaggerModule.setup('api', app, document);

  await app.listen(appPort!);
}
bootstrap();
