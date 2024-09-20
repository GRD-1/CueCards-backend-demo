import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { LanguageRepo } from '@/modules/prisma/repositories/language.repo';
import { JwtService } from '@/modules/jwt/jwt.service';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, PrismaService, LanguageRepo, JwtService],
})
export class LanguageModule {}
