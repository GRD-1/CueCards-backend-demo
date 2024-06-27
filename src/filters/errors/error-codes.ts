export const CCBK_ERROR_CODES = {
  CCBK04_DEACTIVATED_TOKEN: {
    errorCode: 'CCBK01',
    httpStatus: 403,
    errorMessage: 'Deactivated token',
  },
  CCBK03_ACTIVE_TOKEN_ALREADY_EXISTS: {
    errorCode: 'CCBK02',
    httpStatus: 409,
    errorMessage: 'Active token already exists',
  },
  CCBK01_INCORRECT_DATA: {
    errorCode: 'CCBK03',
    httpStatus: 400,
    errorMessage: 'Incorrect data',
  },
  CCBK02_USER_NOT_FOUND: {
    errorCode: 'CCBK04',
    httpStatus: 404,
    errorMessage: 'User not found',
  },
};
