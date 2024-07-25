import { TagEntity } from '@/modules/tag/tag.entity';
import { CardStatisticsEntity } from '@/modules/card-statistics/card-statistics.entity';

export class CardEntity {
  id: number;
  authorId: number;
  fsLanguage: string;
  fsValue: string;
  fsDescription: string | null;
  fsMeaningVariants: string[];
  fsWrongMeanings: string[];
  fsTranscription: string | null;
  fsSynonyms: string[];
  fsAudio: string | null;
  fsHint: string | null;
  bsLanguage: string;
  bsValue: string;
  bsDescription: string | null;
  bsMeaningVariants: string[];
  bsWrongMeanings: string[];
  bsTranscription: string | null;
  bsSynonyms: string[];
  bsAudio: string | null;
  bsHint: string | null;
  createdAt: Date;
  updatedAt: Date;
  deleteMark: boolean;
}

export class CardWithTagsEntity extends CardEntity {
  tags: CardTags[];
}

class CardTags {
  tag: TagEntity;
}

class HiddenCards {
  cardId: number;
  userId: number;
}

export class CardWithSettingsEntity {
  id: number;
  authorId: number;
  fsValue: string;
  bsValue: string;
  tags: TagEntity[];
  statistics: CardStatisticsEntity;
  cardIsHidden: boolean;
}
