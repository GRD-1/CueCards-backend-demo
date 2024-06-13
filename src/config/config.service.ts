import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { EnvSchema } from './config.schema';

class ConfigService {
  private static _instance: ConfigService;
  readonly env: EnvSchema;

  private constructor() {
    dotenv.config();
    this.env = this.validateEnvVariables(process.env);
  }

  static getInstance(): ConfigService {
    if (!ConfigService._instance) {
      ConfigService._instance = new ConfigService();
    }
    return ConfigService._instance;
  }

  private validateEnvVariables(config: Record<string, unknown>): EnvSchema {
    const validatedConfig = plainToInstance(EnvSchema, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) throw new Error(errors.toString());
    return validatedConfig;
  }
}

export default ConfigService.getInstance().env;
