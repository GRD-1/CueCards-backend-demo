import { TagEntity } from '@/modules/tag/tag.entity';
import { CardStatistics } from '@prisma/client';

export class CardEntity {
  id: number;
  authorId: number | null;
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
  tags: CardTags[];
  statistics?: CardStatistics[];
}

class CardTags {
  tag: TagEntity;
}

export class CardListItemEntity {
  id: number;
  fsValue: string;
  bsValue: string;
  tags: CardTags[];
  statistics?: CardStatistics[];
}
