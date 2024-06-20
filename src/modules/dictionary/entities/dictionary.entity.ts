import { ApiProperty } from '@nestjs/swagger';

export class CardReference {
  cardId: number;
  userId: number;
  fs_value: string;
  bs_value: string;
  fsHide?: boolean;
  bsHide?: boolean;
}

export class DictionaryEntity {
  constructor(title: string, tags: string[], cardReferences: CardReference[], id?: number, userId?: number) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.tags = tags;
    this.cardReferences = cardReferences;
  }

  @ApiProperty({ description: 'dictionary identifier', nullable: true })
    id?: number;

  @ApiProperty({ description: 'user identifier', nullable: true })
    userId?: number;

  @ApiProperty({ description: 'dictionary title', nullable: false })
    title: string;

  @ApiProperty({ description: 'dictionary tags', nullable: false })
    tags?: string[];

  @ApiProperty({ description: 'The card belongs to the dictionary', nullable: false })
    cardReferences?: CardReference[];
}
