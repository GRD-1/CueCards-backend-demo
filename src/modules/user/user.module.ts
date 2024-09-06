import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
