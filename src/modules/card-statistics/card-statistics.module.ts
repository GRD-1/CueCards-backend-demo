import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CardStatisticsService } from '@/modules/card-statistics/card-statistics.service';
import { CardStatisticsRepo } from '@/modules/prisma/repositories/card-statistics.repo';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CardStatsController } from './card-statistics.controller';

@Module({
  controllers: [CardStatsController],
  providers: [CardStatisticsService, PrismaService, CardStatisticsRepo, JwtService],
})
export class CardStatisticsModule {}
