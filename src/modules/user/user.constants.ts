// checks if a password has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// validates if passwords are valid bcrypt hashes
export const BCRYPT_HASH = /\$2[abxy]?\$\d{1,2}\$[A-Za-z\d./]{53}/;
