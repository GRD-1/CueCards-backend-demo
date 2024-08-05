import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

export const jwtConfig = registerAs('jwt', () => {
  const publicKey = readFileSync('keys/public.key', 'utf-8');
  const privateKey = readFileSync('keys/private.key', 'utf-8');

  return {
    access: {
      privateKey,
      publicKey,
      time: process.env.JWT_ACCESS_TIME ? parseInt(process.env.JWT_ACCESS_TIME, 10) : 600,
    },
    confirmation: {
      secret: process.env.JWT_CONFIRMATION_SECRET,
      time: process.env.JWT_CONFIRMATION_TIME ? parseInt(process.env.JWT_CONFIRMATION_TIME, 10) : 3600,
    },
    resetPassword: {
      secret: process.env.JWT_RESET_PASSWORD_SECRET,
      time: process.env.JWT_RESET_PASSWORD_TIME ? parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10) : 1800,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      time: process.env.JWT_REFRESH_TIME ? parseInt(process.env.JWT_REFRESH_TIME, 10) : 604800,
    },
  };
});
