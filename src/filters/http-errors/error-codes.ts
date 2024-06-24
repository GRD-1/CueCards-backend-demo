export interface CueCardsErrObj {
  errorCode: string;
  httpStatus: number;
  errorMessage: string;
}

export const CCBK_ERROR_CODES = {
  CCBK01_INCORRECT_DATA: {
    errorCode: 'CCBK01',
    httpStatus: 400,
    errorMessage: 'Incorrect data',
  },
  CCBK04_DEACTIVATED_TOKEN: {
    errorCode: 'CCBK02',
    httpStatus: 403,
    errorMessage: 'Deactivated token',
  },
  CCBK02_USER_NOT_FOUND: {
    errorCode: 'CCBK03',
    httpStatus: 404,
    errorMessage: 'User not found',
  },
  CCBK03_ACTIVE_TOKEN_ALREADY_EXISTS: {
    errorCode: 'CCBK04',
    httpStatus: 409,
    errorMessage: 'Active token already exists',
  },
};
