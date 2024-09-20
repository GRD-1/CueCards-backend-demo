import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { SettingsRepo } from '@/modules/prisma/repositories/settings.repo';
import { JwtService } from '@/modules/jwt/jwt.service';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService, SettingsRepo, JwtService],
})
export class SettingsModule {}
