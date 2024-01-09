import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvSchema } from './env.schema';

enum Environment {
  Development = "dev",
  Production = "prod",
  Test = "test",
  Debug = "debug",
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvSchema, config,{ enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
