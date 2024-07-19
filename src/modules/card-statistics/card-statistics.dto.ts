import { IsBoolean, IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardSide } from '@/modules/card-statistics/card-statistics.interface';

export class CardStatsDto {
  @ApiProperty({ description: 'the total number of user answers to a card front side', nullable: true, example: 1 })
  @IsInt()
    fsTotalAnswers: number;

  @ApiProperty({ description: 'the number of correct answers to a card front side', nullable: true, example: 1 })
  @IsInt()
    fsCorrectAnswers: number;

  @ApiProperty({ description: 'the total number of user answers to a card back side', nullable: true, example: 1 })
  @IsInt()
    bsTotalAnswers: number;

  @ApiProperty({ description: 'the number of correct answers to a card back side', nullable: true, example: 1 })
  @IsInt()
    bsCorrectAnswers: number;
}

export class UpdateStatsDto {
  @ApiProperty({ description: 'the side of card', nullable: true, example: 'frontSide' })
  @IsIn(Object.values(CardSide))
    cardSide: CardSide;

  @ApiProperty({ description: 'is the answer correct?', nullable: true, example: true })
  @IsBoolean()
    isAnswerCorrect: boolean;
}
