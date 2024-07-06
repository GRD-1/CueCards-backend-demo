import { ApiProperty } from '@nestjs/swagger';
import { DictionaryEntity } from '../../dictionary/dictionary.entity';

export class TrainingListEntity {
  constructor(lists: DictionaryEntity[]) {
    this.lists = lists;
  }

  @ApiProperty({ description: 'list of available dictionary', nullable: false })
    lists: DictionaryEntity[];
}
