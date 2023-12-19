import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';
import { AuthModule } from './modules/auth/auth.module';
import { TranslatorModule } from './modules/translator/translator.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UserModule } from './modules/user/user.module';
import { CardModule } from './modules/card/card.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { TrainingListModule } from './modules/training-list/training-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.env', 'env/.env.local_project_root'],
      isGlobal: true
    }),
    AuthModule,
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
  }
}
