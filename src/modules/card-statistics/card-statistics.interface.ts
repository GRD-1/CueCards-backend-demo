export enum CardSide {
  FrontSide = 'frontSide',
  BackSide = 'backSide',
}

export interface UpdateCardStatsInterface {
  cardSide: CardSide;
  isAnswerCorrect: boolean;
}

export interface UpdateCardStatsRepoInterface {
  cardId: number;
  userId: string;
  cardSide: CardSide;
  isAnswerCorrect: boolean;
}
