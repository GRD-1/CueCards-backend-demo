import { registerAs } from '@nestjs/config';
import { PrismaLogLevel } from '@/config/config.interfaces';

export const prismaConfig = registerAs('prisma', () => {
  const arr = process.env.PRISMA_LOG_LEVEL!.split(',').map((v) => v.trim()) as PrismaLogLevel[];
  const allowedPrismaLogLevels = Object.values(PrismaLogLevel);
  arr.push(PrismaLogLevel.Error);
  arr.filter((item: PrismaLogLevel) => !allowedPrismaLogLevels.includes(item));

  return { logLevel: arr };
});
