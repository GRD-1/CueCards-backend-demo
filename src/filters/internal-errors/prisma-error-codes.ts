import { HttpStatus } from '@nestjs/common';

type PrismaToHttpErr = { code: number; msg: string };

export const PrismaErrorCodes = {
  NOT_NULL_VIOLATION: 'P2011',
  NOT_FOUND: 'P2025',
  RELATION_NOT_FOUND: 'P2018',
  INPUT_ERROR: 'P2019',
  UNIQUE_VIOLATION: 'P2002',
  VALUE_TOO_LONG: 'P2001',
  DATA_VALIDATION: 'P2007',
};

export const PRISMA_ERR_TO_HTTP_ERR: Record<string, PrismaToHttpErr> = {
  [PrismaErrorCodes.NOT_FOUND]: { code: HttpStatus.NOT_FOUND, msg: 'Record not found' },
  [PrismaErrorCodes.RELATION_NOT_FOUND]: { code: HttpStatus.NOT_FOUND, msg: 'Not found' },
  [PrismaErrorCodes.INPUT_ERROR]: { code: HttpStatus.BAD_REQUEST, msg: 'Bad request' },
  [PrismaErrorCodes.NOT_NULL_VIOLATION]: { code: HttpStatus.BAD_REQUEST, msg: 'Bad request' },
  [PrismaErrorCodes.UNIQUE_VIOLATION]: { code: HttpStatus.BAD_REQUEST, msg: 'Bad request' },
  [PrismaErrorCodes.VALUE_TOO_LONG]: { code: HttpStatus.BAD_REQUEST, msg: 'Bad request' },
  [PrismaErrorCodes.DATA_VALIDATION]: { code: HttpStatus.BAD_REQUEST, msg: 'Bad request' },
};
