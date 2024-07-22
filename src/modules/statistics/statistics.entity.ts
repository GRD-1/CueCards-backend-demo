export class StatisticsEntity {
  id: number;
  userId: number;
  dictionaryId: number;
  totalAnswers: number;
  correctAnswers: number;
  trainingTime: number;
  hintsCount: number;
  createdAt: Date;
}
