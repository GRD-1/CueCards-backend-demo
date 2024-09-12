import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST as string,
  port: (process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587) as number,
  isSecure: process.env.EMAIL_SECURE === 'true',
  user: process.env.EMAIL_USER as string,
  password: process.env.EMAIL_PASSWORD as string,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_SES_REGION as string,
  ttl: (process.env.EEMAIL_TTL ? parseInt(process.env.EEMAIL_TTL, 10) : 900) as number,
}));
