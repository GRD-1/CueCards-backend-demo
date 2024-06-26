import { HttpStatus } from '@nestjs/common';

type PrismaToHttpErr = { code: number; msg: string };

export const PrismaErrorCodes = {
  NOT_NULL_VIOLATION: 'P2011',
  NOT_FOUND: 'P2025',
  RELATION_NOT_FOUND: 'P2018',
  UNIQUE_VIOLATION: 'P2002',
  VALUE_TOO_LONG: 'P2001',
  DATA_VALIDATION: 'P2007',
};

export const PRISMA_ERR_TO_HTTP_ERR: Record<string, PrismaToHttpErr> = {
  [PrismaErrorCodes.NOT_FOUND]: { code: HttpStatus.NOT_FOUND, msg: 'Record not found' },
  [PrismaErrorCodes.RELATION_NOT_FOUND]: { code: HttpStatus.NOT_FOUND, msg: 'Not found' },
  [PrismaErrorCodes.NOT_NULL_VIOLATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Data conflict' },
  [PrismaErrorCodes.UNIQUE_VIOLATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Data conflict' },
  [PrismaErrorCodes.VALUE_TOO_LONG]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Value to long' },
  [PrismaErrorCodes.DATA_VALIDATION]: { code: HttpStatus.UNPROCESSABLE_ENTITY, msg: 'Unprocessable Data' },
};
