import { AppLogLevel, Environment } from '@/config/config.interfaces';
import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_ID: Joi.string().uuid({ version: 'uuidv4' }).required(),
  APP_NAME: Joi.string().required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  APP_DOMAIN: Joi.string().required(),
  APP_LOG_LEVEL: Joi.string().valid(...Object.values(AppLogLevel)),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
  NODE_PORT_INTERNAL: Joi.number().required(),
  NODE_PORT_EXTERNAL: Joi.number().required(),
  COMPOSE_PROJECT_NAME: Joi.string().required(),
  API_PORT: Joi.number().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT_EXTERNAL: Joi.number().required(),
  POSTGRES_PORT_INTERNAL: Joi.number().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_URL: Joi.string().required(),
  PRISMA_LOG_LEVEL: Joi.string(),
  JWT_ACCESS_TIME: Joi.number().required(),
  JWT_CONFIRMATION_SECRET: Joi.string().required(),
  JWT_CONFIRMATION_TIME: Joi.number().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_TIME: Joi.number().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.number().required(),
  REFRESH_COOKIE: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_SECURE: Joi.bool().required(),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASSWORD: Joi.string().required()
});
