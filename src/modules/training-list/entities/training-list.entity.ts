import { ApiProperty } from '@nestjs/swagger';
import { DictionaryEntity } from '../../dictionaries/entities/dictionaries.entity';

export class TrainingListEntity {
  constructor(lists: DictionaryEntity[]) {
    this.lists = lists;
  }

  @ApiProperty({ description: 'list of available dictionaries', nullable: false })
    lists: DictionaryEntity[];
}
