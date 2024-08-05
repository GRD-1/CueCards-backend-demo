import * as dotenv from 'dotenv';
import { AppLogLevel } from '@/config/config.interfaces';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { CueCardsError } from '@/filters/errors/error.types';

class EnvService {
  private static _instance: EnvService;
  readonly env: { [key: string]: string | undefined };

  private constructor() {
    dotenv.config();
    this.env = process.env;
  }

  static getInstance(): EnvService {
    if (!EnvService._instance) {
      dotenv.config();
      EnvService._instance = new EnvService();
    }

    return EnvService._instance;
  }

  getAppLogLevel(): AppLogLevel {
    return this.env.APP_LOG_LEVEL ? (this.env.APP_LOG_LEVEL as AppLogLevel) : AppLogLevel.Log;
  }

  getAppPort(): number {
    if (!this.env.APP_PORT) {
      throw new CueCardsError(CCBK_ERROR_CODES.ENV_VALIDATION_ERROR, 'APP_PORT was not defined');
    }

    return parseInt(this.env.APP_PORT, 10);
  }
}

export default EnvService.getInstance();
