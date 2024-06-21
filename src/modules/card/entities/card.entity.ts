import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class CardEntity {
  @ApiProperty({ description: 'card identifier', nullable: true })
  id: number;

  @ApiProperty({ description: 'front side language', nullable: false })
  fsLanguage: number;

  @ApiProperty({ description: 'front side value', nullable: false })
  fsValue: string;

  @ApiProperty({ description: 'description for the front side value: proverb, swearing e.t.c', default: '' })
  fsDescription: string;

  @ApiProperty({ description: 'front side value translation variants', nullable: true })
  fsMeaningVariants: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true })
  fsWrongMeanings: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false })
  fsTranscription: string;

  @ApiProperty({ description: 'front side value synonyms', nullable: true })
  fsSynonyms: string[];

  @ApiProperty({ description: 'front side audio', nullable: true })
  fsAudio: string;

  @ApiProperty({ description: 'front side hint which helps to remember the translation', nullable: true })
  fsHint: string;

  @ApiProperty({ description: 'back side language', nullable: false })
  bsLanguage: number;

  @ApiProperty({ description: 'back side value', nullable: false })
  bsValue: string;

  @ApiProperty({ description: 'description for the back side value: proverb, swearing e.t.c', nullable: false })
  bsDescription: string;

  @ApiProperty({ description: 'back side value translation variants', nullable: true })
  bsMeaningVariants: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true })
  bsWrongMeanings: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false })
  bsTranscription: string;

  @ApiProperty({ description: 'back side value synonyms', nullable: true })
  bsSynonyms: string[];

  @ApiProperty({ description: 'back side audio', nullable: true })
  bsAudio: string;

  @ApiProperty({ description: 'back side hint which helps to remember the translation', nullable: true })
  bsHint: string;

  @ApiProperty({ description: 'tag list', nullable: true })
  tags: string[];

  @ApiProperty({ description: 'author identifier', nullable: false })
  author: UserEntity;

  @ApiProperty({ description: 'creation date', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
  updateAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
  deleteMark: boolean;
}
