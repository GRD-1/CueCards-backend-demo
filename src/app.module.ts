import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { TagModule } from '@/modules/tag/tag.module';
import { CardStatisticsModule } from '@/modules/card-statistics/card-statistics.module';
import { LanguageModule } from '@/modules/language/language.module';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UserModule } from './modules/user/user.module';
import { CardModule } from './modules/card/card.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    PrismaModule,
    CardModule,
    CardStatisticsModule,
    DictionaryModule,
    TagModule,
    StatisticsModule,
    SettingsModule,
    UserModule,
    LanguageModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
