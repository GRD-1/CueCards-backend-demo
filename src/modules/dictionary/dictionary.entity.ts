import { TagEntity } from '@/modules/tag/tag.entity';

export class DictionaryEntity {
  id: number;
  authorId: number | null;
  name: string;
  tags: DictionaryTags[];
}

class DictionaryTags {
  tag: TagEntity;
}
