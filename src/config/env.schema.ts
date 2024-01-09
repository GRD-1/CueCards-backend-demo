import { Injectable } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';

enum Environment {
  Development = "dev",
  Production = "prod",
  Test = "test",
  Debug = "debug",
}

@Injectable()
export class EnvSchema {
  /* Mode ------------------------------------------------------ */
  @IsString()
    NODE_ENV: Environment;

  @IsString()
    COMPOSE_PROJECT_NAME: string;

  /* JWT ------------------------------------------------------- */
  @IsString()
    JWT_SECRET: string;

  @IsNumber()
    APP_EXPIRES: number;

  /* Local project root ---------------------------------------- */
  @IsString()
    LOCAL_PROJECT_ROOT: string;

  @IsString()
    LOCAL_PROJECT_ROOT_DOCKER: string;

  /* Node ------------------------------------------------------ */
  @IsNumber()
    NODE_PORT_EXTERNAL: number;

  @IsNumber()
    NODE_PORT_INTERNAL: number;

  @IsNumber()
    NODE_DEBUG_PORT_EXTERNAL: number;

  @IsNumber()
    NODE_DEBUG_PORT_INTERNAL: number;

  /* Postgres -------------------------------------------------- */
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
}
