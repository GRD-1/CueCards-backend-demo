import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UpdateCardStatsRepoInterface } from '@/modules/card-statistics/card-statistics.interface';

@Injectable()
export class CardStatisticsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async updateCardStatistics(args: UpdateCardStatsRepoInterface): Promise<void> {
    const { cardId, authorId, cardSide, isAnswerCorrect } = args;
    let fieldOne: string;
    let fieldTwo: string;

    if (cardSide === 'frontSide') {
      fieldOne = 'fsTotalAnswers';
      fieldTwo = 'fsCorrectAnswers';
    } else {
      fieldOne = 'bsTotalAnswers';
      fieldTwo = 'bsCorrectAnswers';
    }

    await this.prisma.cardStatistics.upsert({
      where: { cardId_authorId: { cardId, authorId } },
      update: {
        [fieldOne]: { increment: 1 },
        [fieldTwo]: isAnswerCorrect ? { increment: 1 } : undefined,
      },
      create: {
        cardId,
        authorId,
        fsTotalAnswers: fieldOne === 'fsTotalAnswers' ? 1 : 0,
        fsCorrectAnswers: fieldTwo === 'fsCorrectAnswers' ? 1 : 0,
        bsTotalAnswers: fieldOne === 'bsTotalAnswers' ? 1 : 0,
        bsCorrectAnswers: fieldTwo === 'bsCorrectAnswers' ? 1 : 0,
      },
    });
  }
}
