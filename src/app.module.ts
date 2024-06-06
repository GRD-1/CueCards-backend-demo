import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';
import { TranslatorModule } from './modules/translator/translator.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UserModule } from './modules/user/user.module';
import { CardModule } from './modules/card/card.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { TrainingListModule } from './modules/training-list/training-list.module';
import { PostgresConnectionOptions } from './typeorm/data-source';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRoot(PostgresConnectionOptions),
    TranslatorModule,
    CardModule,
    DictionaryModule,
    TrainingListModule,
    TranslatorModule,
    StatisticsModule,
    SettingsModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
