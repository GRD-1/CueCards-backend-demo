import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { TagModule } from '@/modules/tag/tag.module';
import { CardStatisticsModule } from '@/modules/card-statistics/card-statistics.module';
import { LanguageModule } from '@/modules/language/language.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from '@/config/config.schema';
import {
  appConfig,
  cacheConfig,
  emailConfig,
  jwtConfig,
  nodeConfig,
  postgresConfig,
  prismaConfig,
  redisConfig,
} from '@/config/configs';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { MailerModule } from '@/modules/mailer/mailer.module';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UserModule } from './modules/user/user.module';
import { CardModule } from './modules/card/card.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheService } from './modules/cache/cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig, emailConfig, jwtConfig, nodeConfig, postgresConfig, prismaConfig, redisConfig, cacheConfig],
      cache: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    CardModule,
    CardStatisticsModule,
    DictionaryModule,
    TagModule,
    StatisticsModule,
    SettingsModule,
    UserModule,
    LanguageModule,
    JwtModule,
    AuthModule,
    MailerModule,
  ],
  providers: [CacheService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
