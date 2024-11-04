import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

export const jwtConfig = registerAs('jwt', () => {
  const testMode = process.env.CI === 'true';
  const publicKey = testMode ? 'test-public-key' : readFileSync('keys/public.pem', 'utf-8');
  const privateKey = testMode ? 'test-private-key' : readFileSync('keys/private.pem', 'utf-8');

  return {
    publicKey,
    privateKey,
    access: {
      time: (process.env.JWT_ACCESS_TTL ? parseInt(process.env.JWT_ACCESS_TTL, 10) : 600) as number,
    },
    refresh: {
      time: (process.env.JWT_REFRESH_TTL ? parseInt(process.env.JWT_REFRESH_TTL, 10) : 604800) as number,
    },
  };
});
