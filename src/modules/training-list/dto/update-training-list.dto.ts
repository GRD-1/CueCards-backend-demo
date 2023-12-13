import { ApiProperty } from '@nestjs/swagger';
import { DictionaryEntity } from '../../dictionaries/entities/dictionaries.entity';

export class UpdateTrainingListDto {
  @ApiProperty({ description: 'list of available dictionaries', nullable: false })
    lists: DictionaryEntity[];
}
