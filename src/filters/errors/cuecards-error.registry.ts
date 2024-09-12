import { ErrorToHttpInterface } from '@/filters/errors/error.types';
import { HttpStatus } from '@nestjs/common';

export const CCBK_ERROR_CODES = {
  INTERNAL_SERVER_ERROR: 'CCBK01',
  UNAUTHORIZED: 'CCBK02',
  FORBIDDEN: 'CCBK03',
  INVALID_DATA: 'CCBK04',
  RECORD_NOT_FOUND: 'CCBK05',
  UNIQUE_VIOLATION: 'CCBK06',
  BAD_REQUEST: 'CCBK07',
  INVALID_CREDENTIALS: 'CCBK08',
  ENV_VALIDATION_ERROR: 'CCBK09',
  UNCONFIRMED_EMAIL: 'CCBK10',
};

export const CCBK_ERR_TO_HTTP: Record<string, ErrorToHttpInterface> = {
  [CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal server error',
  },
  [CCBK_ERROR_CODES.UNAUTHORIZED]: {
    error: true,
    statusCode: HttpStatus.UNAUTHORIZED,
    errorMsg: 'Authorization is required',
  },
  [CCBK_ERROR_CODES.FORBIDDEN]: {
    error: true,
    statusCode: HttpStatus.FORBIDDEN,
    errorMsg: 'Access denied',
  },
  [CCBK_ERROR_CODES.INVALID_DATA]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'Invalid data',
  },
  [CCBK_ERROR_CODES.RECORD_NOT_FOUND]: {
    error: true,
    statusCode: HttpStatus.NOT_FOUND,
    errorMsg: 'The record was not found',
  },
  [CCBK_ERROR_CODES.UNIQUE_VIOLATION]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'The record with that value already exists',
  },
  [CCBK_ERROR_CODES.BAD_REQUEST]: {
    error: true,
    statusCode: HttpStatus.BAD_REQUEST,
    errorMsg: 'Bad Request',
  },
  [CCBK_ERROR_CODES.INVALID_CREDENTIALS]: {
    error: true,
    statusCode: HttpStatus.UNAUTHORIZED,
    errorMsg: 'Authorization failed',
  },
  [CCBK_ERROR_CODES.ENV_VALIDATION_ERROR]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Env validation failed',
  },
  [CCBK_ERROR_CODES.UNCONFIRMED_EMAIL]: {
    error: true,
    statusCode: HttpStatus.UNAUTHORIZED,
    errorMsg: 'Unconfirmed email',
  },
};
