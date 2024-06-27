export interface PrismaToHttpErr {
  code: number;
  msg: string;
}

export interface CCErrorObj {
  errorCode: string;
  httpStatus: number;
  errorMessage: string;
}

export interface CCErrHttpResponse {
  errorCode: string;
  errorMessage: string;
  timestamp: number;
}
