import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.env', 'env/.env.project_root'],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
  }
}
