import { Injectable } from '@nestjs/common';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Environment, LogLevel, PrismaLogLevel } from '@/config/config.interfaces';
import { Transform } from 'class-transformer';

@Injectable()
export class EnvSchema {
  @IsString()
    NODE_ENV: Environment = Environment.Development;

  @IsString()
    APP_NAME: string;

  @IsString()
    COMPOSE_PROJECT_NAME: string;

  @IsString()
    APP_HOST: string;

  @IsNumber()
    APP_PORT: number;

  @IsString()
    JWT_SECRET: string;

  @IsNumber()
    JWT_EXPIRES: number;

  @IsString()
    POSTGRES_HOST: string;

  @IsNumber()
    POSTGRES_PORT_EXTERNAL: number;

  @IsNumber()
    POSTGRES_PORT_INTERNAL: number;

  @IsString()
    POSTGRES_DB: string;

  @IsString()
    POSTGRES_USER: string;

  @IsString()
    POSTGRES_PASSWORD: string;

  @IsString()
    POSTGRES_URL: string;

  @IsString()
    LOG_LEVEL: LogLevel = LogLevel.Debug;

  @IsArray()
  @Transform(({ value }) => value.split(',').map((item: string) => item.trim()))
    PRISMA_LOGLEVEL: PrismaLogLevel[] = [PrismaLogLevel.Error];
}
