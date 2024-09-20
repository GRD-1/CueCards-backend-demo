import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { StatisticsRepo } from '@/modules/prisma/repositories/statistics.repo';
import { JwtService } from '@/modules/jwt/jwt.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, StatisticsRepo, JwtService],
})
export class StatisticsModule {}
