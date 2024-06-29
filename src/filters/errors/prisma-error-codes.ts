import { HttpStatus } from '@nestjs/common';
import { PrismaToHttpErr } from '@/filters/errors/error.interfaces';

export const PrismaErrorCodes = {
  VALUE_TOO_LONG: 'P2001',
  UNIQUE_VIOLATION: 'P2002',
  FOREIGN_KEY_CONSTRAINT_FAILED: 'P2003',
  DATA_VALIDATION: 'P2007',
  RAW_QUERY_FAILED: 'P2010',
  NOT_NULL_VIOLATION: 'P2011',
  RELATION_NOT_FOUND: 'P2018',
  INPUT_ERROR: 'P2019',
  NOT_FOUND: 'P2025',
};

export const PRISMA_ERR_TO_HTTP_ERR: Record<string, PrismaToHttpErr> = {
  [PrismaErrorCodes.VALUE_TOO_LONG]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Value to long' },
  [PrismaErrorCodes.UNIQUE_VIOLATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Data conflict' },
  [PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Invalid data' },
  [PrismaErrorCodes.DATA_VALIDATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Unprocessable Data' },
  [PrismaErrorCodes.RAW_QUERY_FAILED]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Data conflict' },
  [PrismaErrorCodes.NOT_NULL_VIOLATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Data conflict' },
  [PrismaErrorCodes.RELATION_NOT_FOUND]: { code: HttpStatus.BAD_REQUEST, msg: 'Not found' },
  [PrismaErrorCodes.INPUT_ERROR]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Unprocessable Data' },
  [PrismaErrorCodes.NOT_FOUND]: { code: HttpStatus.BAD_REQUEST, msg: 'The record was not found' },
};
