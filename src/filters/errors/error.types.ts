import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class CueCardsError extends Error {}

export interface ErrorToHttpInterface {
  error: boolean;
  statusCode: HttpStatus;
  errorMsg: string;
}

export type GlobalExceptionType = Error | CueCardsError | HttpException | Prisma.PrismaClientKnownRequestError;
