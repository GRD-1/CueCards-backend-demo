import { CueCardsErrObj } from '@/filters/errors/error-codes';

interface CueCardsHttpResponse {
  errorCode: string;
  errorMessage: string;
  timestamp: number;
}

export class CueCardsHttpError {
  private readonly httpResponse: CueCardsHttpResponse;
  private readonly httpStatus: number;
  private readonly errorCode: string;

  constructor(error: CueCardsErrObj, additionalMessage?: string) {
    this.errorCode = error.errorCode;
    this.httpStatus = error.httpStatus;

    const errorMessage = error.errorMessage + (additionalMessage ? `: ${additionalMessage}` : '');

    this.httpResponse = {
      errorCode: this.errorCode,
      errorMessage,
      timestamp: new Date().getTime(),
    };
  }

  getResponse(): CueCardsHttpResponse {
    return this.httpResponse;
  }

  getStatus(): number {
    return this.httpStatus;
  }
}
