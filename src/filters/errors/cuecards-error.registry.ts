import { ErrorToHttpInterface } from '@/filters/errors/error.types';
import { HttpStatus } from '@nestjs/common';

export const CCBK_ERROR_CODES = {
  INTERNAL_SERVER_ERROR: 'CCBK01',
  TOKEN_DEACTIVATED: 'CCBK02',
  TOKEN_ALREADY_EXISTS: 'CCBK03',
  INVALID_DATA: 'CCBK04',
  USER_NOT_FOUND: 'CCBK05',
};

export const CCBK_ERROR_TO_HTTP: Record<string, ErrorToHttpInterface> = {
  [CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal server error',
  },
  [CCBK_ERROR_CODES.TOKEN_DEACTIVATED]: {
    error: true,
    statusCode: HttpStatus.FORBIDDEN,
    errorMsg: 'Deactivated token',
  },
  [CCBK_ERROR_CODES.TOKEN_ALREADY_EXISTS]: {
    error: true,
    statusCode: HttpStatus.CONFLICT,
    errorMsg: 'Token already exists',
  },
  [CCBK_ERROR_CODES.INVALID_DATA]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'Invalid data',
  },
  [CCBK_ERROR_CODES.USER_NOT_FOUND]: {
    error: true,
    statusCode: HttpStatus.BAD_REQUEST,
    errorMsg: 'The user already exists',
  },
};
