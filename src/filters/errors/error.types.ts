import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class CueCardsError extends Error {
  constructor(public code: string, public message: string, public cause?: string) {
    super(message);
    this.name = 'CueCardsError';
  }
}

export interface ErrorToHttpInterface {
  error: boolean;
  statusCode: HttpStatus;
  errorMsg: string;
}

export type GlobalExceptionType = Error | CueCardsError | HttpException | Prisma.PrismaClientKnownRequestError;
