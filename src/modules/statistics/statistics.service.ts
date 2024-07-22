import { Injectable } from '@nestjs/common';
import {
  FindManyStatsFullRespInterface,
  FindManyStatsInterface,
  StatsInterface,
} from '@/modules/statistics/statistics.interface';
import { StatisticsRepo } from '@/modules/prisma/repositories/statistics.repo';
import { StatisticsEntity } from '@/modules/statistics/statistics.entity';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepo: StatisticsRepo) {}

  async create(args: StatsInterface): Promise<number> {
    return this.statisticsRepo.create(args);
  }

  async findMany(args: FindManyStatsInterface): Promise<FindManyStatsFullRespInterface> {
    const [{ page, pageSize, statistics }, totalRecords] = await Promise.all([
      this.statisticsRepo.findMany(args),
      this.statisticsRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: statistics.length, totalRecords, statistics };
  }

  async getLastResults(args: FindManyStatsInterface): Promise<StatisticsEntity[]> {
    return this.statisticsRepo.getLastResults(args);
  }
}
