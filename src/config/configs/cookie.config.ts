import { registerAs } from '@nestjs/config';

export const cookieConfig = registerAs('cookie', () => ({
  name: process.env.REFRESH_COOKIE,
  secret: process.env.COOKIE_SECRET,
}));
