import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvSchema } from './config.schema';

export function validateEnvVariables(config: Record<string, unknown>): EnvSchema {
  const validatedConfig = plainToInstance(EnvSchema, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) throw new Error(errors.toString());
  return validatedConfig;
}
