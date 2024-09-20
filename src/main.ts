import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const httpsOptions = {
    key: readFileSync('certificates/private-key.pem'),
    cert: readFileSync('certificates/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);
  const appConf = configService.get('app');
  const nodeConf = configService.get('node');

  app.enableCors({ origin: appConf.corsDomains });
  app.useLogger([appConf.logLevel]);
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

  if (nodeConf.mode === 'development') {
    const params = new DocumentBuilder()
      .setTitle('CueCards API')
      .setDescription('')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, params);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appConf.port);
}
bootstrap();
