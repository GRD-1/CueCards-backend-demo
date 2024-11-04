import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

const prisma = new PrismaClient();

const seedTestData = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      id: '1',
      email: 'defaultUser.email',
      nickname: 'defaultUser.nickname',
      avatar: 'defaultUser.avatar',
      confirmed: true,
    },
  });
};

const seedDefaultData = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      id: '2',
      email: 'testUser.email',
      nickname: 'testUser.nickname',
      avatar: 'testUser.avatar',
      confirmed: true,
    },
  });
};

const main = async (): Promise<void> => {
  dotenv.config();
  const environment = process.env.PRISMA_ENV;

  try {
    if (environment === 'test') {
      await seedTestData();
    } else {
      await seedDefaultData();
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
