import { StatisticsEntity } from '@/modules/statistics/statistics.entity';

export interface StatsInterface {
  userId: string;
  dictionaryId: number;
  totalAnswers: number;
  correctAnswers: number;
  trainingTime: number;
  hintsCount: number;
}

export interface FindManyStatsInterface {
  userId: string;
  page?: number;
  pageSize?: number;
  dictionaryId?: number;
  selectionStart?: Date;
  selectionEnd?: Date;
}

export interface FindManyStatsRespInterface {
  page: number;
  pageSize: number;
  statistics: StatisticsEntity[];
}

export interface FindManyStatsFullRespInterface extends FindManyStatsRespInterface {
  records: number;
  totalRecords: number;
}

export interface SearchConditionsArgsInterface extends Omit<FindManyStatsInterface, 'page' | 'pageSize'> {
  userId: string;
}

export interface FindManyStatsConditionsInterface {
  userId?: string;
  dictionaryId?: number;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface GetLastResultsArgsInterface extends Pick<FindManyStatsInterface, 'userId' | 'dictionaryId'> {
  userId: string;
  dictionaryId?: number;
}
