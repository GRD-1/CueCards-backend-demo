import { IsBoolean, IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardSide } from '@/modules/card-statistics/card-statistics.interface';

export class CardStatsDto {
  @ApiProperty({ description: 'the total number of user answers to a card front side', nullable: true, example: 1 })
  @IsInt()
  readonly fsTotalAnswers: number;

  @ApiProperty({ description: 'the number of correct answers to a card front side', nullable: true, example: 1 })
  @IsInt()
  readonly fsCorrectAnswers: number;

  @ApiProperty({ description: 'the total number of user answers to a card back side', nullable: true, example: 1 })
  @IsInt()
  readonly bsTotalAnswers: number;

  @ApiProperty({ description: 'the number of correct answers to a card back side', nullable: true, example: 1 })
  @IsInt()
  readonly bsCorrectAnswers: number;
}

export class UpdateStatsDto {
  @ApiProperty({ description: 'the side of card', nullable: true, example: 'frontSide' })
  @IsIn(Object.values(CardSide))
  readonly cardSide: CardSide;

  @ApiProperty({ description: 'is the answer correct?', nullable: true, example: true })
  @IsBoolean()
  readonly isAnswerCorrect: boolean;
}
