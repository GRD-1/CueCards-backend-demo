import { Injectable } from '@nestjs/common';
import { CardStatisticsRepo } from '@/modules/prisma/repositories/card-statistics.repo';
import { UpdateCardStatsInterface } from '@/modules/card-statistics/card-statistics.interface';

@Injectable()
export class CardStatisticsService {
  constructor(private readonly cardStatsRepo: CardStatisticsRepo) {}

  async updateCardStatistics(cardId: number, userId: string, payload: UpdateCardStatsInterface): Promise<void> {
    return this.cardStatsRepo.updateCardStatistics({ cardId, userId, ...payload });
  }
}
