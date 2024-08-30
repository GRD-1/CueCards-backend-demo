import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

export const jwtConfig = registerAs('jwt', () => {
  const publicKey = readFileSync('keys/public.pem', 'utf-8');
  const privateKey = readFileSync('keys/private.pem', 'utf-8');

  return {
    publicKey,
    privateKey,
    access: {
      time: process.env.JWT_ACCESS_TIME ? parseInt(process.env.JWT_ACCESS_TIME, 10) : 600,
    },
    refresh: {
      time: process.env.JWT_REFRESH_TIME ? parseInt(process.env.JWT_REFRESH_TIME, 10) : 604800,
    },
  };
});
