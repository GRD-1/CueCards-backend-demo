import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardEntity {
  @ApiProperty({ description: 'card id', nullable: true })
    id?: number;

  @ApiProperty({ description: 'user id', nullable: true })
    authorId: number | null;

  @ApiProperty({ description: 'front side language', nullable: false })
  @IsString()
    fsLanguage: string;

  @ApiProperty({ description: 'front side value', nullable: false })
  @IsString()
    fsValue: string;

  @ApiProperty({ description: 'description for the front side value: proverb, swearing e.t.c', default: '' })
  @IsString()
    fsDescription: string | null;

  @ApiProperty({ description: 'front side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fsMeaningVariants: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fsWrongMeanings: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false })
  @IsString()
    fsTranscription: string | null;

  @ApiProperty({ description: 'front side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fsSynonyms: string[];

  @ApiProperty({ description: 'front side audio', nullable: true })
  @IsString()
    fsAudio: string | null;

  @ApiProperty({ description: 'front side hint which helps to remember the translation', nullable: true })
  @IsString()
    fsHint: string | null;

  @ApiProperty({ description: 'back side language', nullable: false })
  @IsString()
    bsLanguage: string;

  @ApiProperty({ description: 'back side value', nullable: false })
  @IsString()
    bsValue: string;

  @ApiProperty({ description: 'description for the back side value: proverb, swearing e.t.c', nullable: false })
  @IsString()
    bsDescription: string | null;

  @ApiProperty({ description: 'back side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bsMeaningVariants: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bsWrongMeanings: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false })
  @IsString()
    bsTranscription: string | null;

  @ApiProperty({ description: 'back side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bsSynonyms: string[];

  @ApiProperty({ description: 'back side audio', nullable: true })
    bsAudio: string | null;

  @ApiProperty({ description: 'back side hint which helps to remember the translation', nullable: true })
    bsHint: string | null;

  @ApiProperty({ description: 'Card tags', nullable: true })
  @IsArray()
  @IsString({ each: true })
    tags: string[];

  @ApiProperty({ description: 'creation date', nullable: false })
    createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
    updatedAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
    deleteMark: boolean;
}
