import { MiddlewareConsumer, Module } from '@nestjs/common';
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
  userConfig,
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
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheService } from './modules/cache/cache.service';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [
        appConfig,
        emailConfig,
        jwtConfig,
        nodeConfig,
        postgresConfig,
        prismaConfig,
        redisConfig,
        cacheConfig,
        userConfig,
      ],
      cache: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis').host,
        port: configService.get('redis').portExternal,
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
  }
}
