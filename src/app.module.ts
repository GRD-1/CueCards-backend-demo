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
import { UsersModule } from './modules/users/users.module';
import { CardsModule } from './modules/cards/cards.module';
import { DictionariesModule } from './modules/dictionaries/dictionaries.module';
import { TrainingListModule } from './modules/training-list/training-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.env', 'env/.env.project_root'],
      isGlobal: true
    }),
    AuthModule,
    TranslatorModule,
    CardsModule,
    DictionariesModule,
    TrainingListModule,
    TranslatorModule,
    StatisticsModule,
    SettingsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
  }
}
