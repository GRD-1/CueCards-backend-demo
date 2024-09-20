import { HttpStatus } from '@nestjs/common';
import { ErrorToHttpInterface } from '@/filters/errors/error.types';

export const PRISMA_ERROR_CODES = {
  VALUE_TOO_LONG: 'P2001',
  UNIQUE_VIOLATION: 'P2002',
  FOREIGN_KEY_CONSTRAINT_FAILED: 'P2003',
  DATA_VALIDATION: 'P2007',
  RAW_QUERY_FAILED: 'P2010',
  NOT_NULL_VIOLATION: 'P2011',
  RELATION_NOT_FOUND: 'P2018',
  RECORD_NOT_FOUND: 'P2025',
  INPUT_ERROR: 'P2019',
};

export const PRISMA_ERR_TO_HTTP: Record<string, ErrorToHttpInterface> = {
  [PRISMA_ERROR_CODES.VALUE_TOO_LONG]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'Value to long',
  },
  [PRISMA_ERROR_CODES.UNIQUE_VIOLATION]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'Unique key violation',
  },
  [PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILED]: {
    error: true,
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorMsg: 'Constraint violation',
  },
  [PRISMA_ERROR_CODES.DATA_VALIDATION]: {
    error: true,
    statusCode: HttpStatus.BAD_REQUEST,
    errorMsg: 'Invalid Data',
  },
  [PRISMA_ERROR_CODES.RAW_QUERY_FAILED]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal Server Error',
  },
  [PRISMA_ERROR_CODES.NOT_NULL_VIOLATION]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal Server Error',
  },
  [PRISMA_ERROR_CODES.RELATION_NOT_FOUND]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal Server Error',
  },
  [PRISMA_ERROR_CODES.RECORD_NOT_FOUND]: {
    error: true,
    statusCode: HttpStatus.NOT_FOUND,
    errorMsg: 'The record was not found',
  },
  [PRISMA_ERROR_CODES.INPUT_ERROR]: {
    error: true,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorMsg: 'Internal Server Error',
  },
};
