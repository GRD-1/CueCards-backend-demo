import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { EnvSchema } from './config.schema';

@Injectable()
export class ConfigService {
  readonly env: EnvSchema;

  constructor() {
    dotenv.config();
    this.env = this.validateEnvVariables(process.env);
  }

  private validateEnvVariables(config: Record<string, unknown>): EnvSchema {
    const validatedConfig = plainToInstance(EnvSchema, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) throw new Error(errors.toString());
    return validatedConfig;
  }
}

const config = new ConfigService();
export default config.env;
