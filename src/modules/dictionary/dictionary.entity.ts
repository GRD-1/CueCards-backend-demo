import { TagEntity } from '@/modules/tag/tag.entity';
import { CardEntity } from '@/modules/card/card.entity';

export class DictionaryEntity {
  id: number;
  authorId: number | null;
  name: string;
}

export class DictionaryWithTagsEntity extends DictionaryEntity {
  tags: TagEntity[];
}

export class DictionaryWithTagsPrismaEntity extends DictionaryEntity {
  tags: {
    tag: TagEntity;
  }[];
}

export class DictionaryWithTagsAndCardsEntity extends DictionaryWithTagsEntity {
  cards: CardEntity[];
}
