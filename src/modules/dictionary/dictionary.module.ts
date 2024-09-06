import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import { JwtService } from '@/modules/jwt/jwt.service';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService, PrismaService, DictionaryRepo, JwtService],
})
export class DictionaryModule {}
