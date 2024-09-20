export class StatisticsEntity {
  id: number;
  userId: string;
  dictionaryId: number;
  totalAnswers: number;
  correctAnswers: number;
  trainingTime: number;
  hintsCount: number;
  createdAt: Date;
}
