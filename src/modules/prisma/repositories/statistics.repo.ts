import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  FindManyStatsConditionsInterface,
  FindManyStatsInterface,
  FindManyStatsRespInterface,
  GetLastResultsArgsInterface,
  SearchConditionsArgsInterface,
  StatsInterface,
} from '@/modules/statistics/statistics.interface';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { StatisticsEntity } from '@/modules/statistics/statistics.entity';
import { STATISTICS_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/statistics.select-options';
import { INVALID_RELATION_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class StatisticsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: StatsInterface): Promise<number> {
    const newRecord = await this.prisma.statistics
      .create({
        data: args,
      })
      .catch((err) => {
        if (err.code === 'P2003') {
          throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, INVALID_RELATION_ERR_MSG);
        }
        throw err;
      });

    return newRecord.id;
  }

  async findMany(args: FindManyStatsInterface): Promise<FindManyStatsRespInterface> {
    const searchConditions = this.getStatisticsSearchConditions(args);
    const { page = 1, pageSize = 20 } = args;

    const statistics = await this.prisma.statistics.findMany({
      select: STATISTICS_SELECT_OPTIONS,
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, statistics };
  }

  async getTotalCount(args: FindManyStatsInterface): Promise<number> {
    const searchConditions = this.getStatisticsSearchConditions(args);

    return this.prisma.statistics.count({ where: searchConditions });
  }

  getStatisticsSearchConditions(args: SearchConditionsArgsInterface): FindManyStatsConditionsInterface {
    const { userId, dictionaryId, selectionStart, selectionEnd } = args;
    const searchConditions: FindManyStatsConditionsInterface = { userId, dictionaryId };

    if (selectionStart && selectionEnd) {
      searchConditions.createdAt = {
        gte: selectionStart,
        lte: selectionEnd,
      };
    } else if (selectionStart) {
      searchConditions.createdAt = {
        gte: selectionStart,
      };
    } else if (selectionEnd) {
      searchConditions.createdAt = {
        lte: selectionEnd,
      };
    }

    return searchConditions;
  }

  async getLastResults(args: GetLastResultsArgsInterface): Promise<StatisticsEntity[]> {
    const { userId, dictionaryId } = args;

    const searchConditions: string[] = [`"userId" = ${userId}`];

    if (dictionaryId) {
      searchConditions.push(`"dictionaryId" = ${dictionaryId}`);
    }

    const whereClause = searchConditions.length ? `WHERE ${searchConditions.join(' AND ')}` : '';
    const keys = `"${Object.keys(STATISTICS_SELECT_OPTIONS).join('", "')}"`;

    const query = `
    SELECT ${keys}
    FROM (
      SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY "userId", "dictionaryId" ORDER BY "createdAt" DESC) as row_num
      FROM statistics
      ${whereClause}
    ) as ranked
    WHERE row_num = 1;
  `;

    return this.prisma.$queryRawUnsafe(query);
  }
}
