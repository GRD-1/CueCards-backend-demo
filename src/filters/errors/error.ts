import { CCErrHttpResponse, CCErrorObj } from '@/filters/errors/error.interfaces';

export class CueCardsHttpError {
  private readonly httpResponse: CCErrHttpResponse;
  private readonly httpStatus: number;
  private readonly errorCode: string;

  constructor(error: CCErrorObj, additionalMessage?: string) {
    this.errorCode = error.errorCode;
    this.httpStatus = error.httpStatus;

    const errorMessage = error.errorMessage + (additionalMessage ? `: ${additionalMessage}` : '');

    this.httpResponse = {
      errorCode: this.errorCode,
      errorMessage,
      timestamp: new Date().getTime(),
    };
  }

  getResponse(): CCErrHttpResponse {
    return this.httpResponse;
  }

  getStatus(): number {
    return this.httpStatus;
  }
}
