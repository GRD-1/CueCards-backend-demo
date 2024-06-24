import { ApiProperty } from '@nestjs/swagger';
import { DictionaryEntity } from '../../dictionary/dictionary.entity';

export class UpdateTrainingListDto {
  @ApiProperty({ description: 'list of available dictionary', nullable: false })
    lists: DictionaryEntity[];
}
