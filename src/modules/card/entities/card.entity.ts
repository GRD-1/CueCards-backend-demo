import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardEntity {
  constructor(
    fsLanguage: number,
    fsValue: string,
    fsMeaningVariants: string[],
    fsTranscription: string,
    bsLanguage: number,
    bsValue: string,
    bsTranscription: string,
    fsWrongMeanings?: string[],
    fsSynonyms?: string[],
    fsAudio?: string,
    bsMeaningVariants?: string[],
    bsWrongMeanings?: string[],
    bsSynonyms?: string[],
    bsAudio?: string,
    tags?: string[],
    id?: number,
    userId?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.fs_language = fsLanguage;
    this.fs_value = fsValue;
    this.fs_meaning_variants = fsMeaningVariants;
    this.fs_wrong_meanings = fsWrongMeanings;
    this.fs_transcription = fsTranscription;
    this.fs_synonyms = fsSynonyms;
    this.fs_audio = fsAudio;
    this.bs_language = bsLanguage;
    this.bs_value = bsValue;
    this.bs_meaning_variants = bsMeaningVariants;
    this.bs_wrong_meanings = bsWrongMeanings;
    this.bs_transcription = bsTranscription;
    this.bs_synonyms = bsSynonyms;
    this.bs_audio = bsAudio;
    this.tags = tags;
  }

  @ApiProperty({ description: 'card identifier', nullable: true })
  @PrimaryGeneratedColumn()
    id?: number;

  @ApiProperty({ description: 'user identifier', nullable: true })
  @Column()
    userId?: number;

  @ApiProperty({ description: 'front side language', nullable: false })
  @Column()
    fs_language: number;

  @ApiProperty({ description: 'front side value', nullable: false })
  @Column()
    fs_value: string;

  @ApiProperty({ description: 'front side value translation variants', nullable: true })
  @Column()
    fs_meaning_variants?: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true })
  @Column()
    fs_wrong_meanings?: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false })
  @Column()
    fs_transcription: string;

  @ApiProperty({ description: 'front side value synonyms', nullable: true })
  @Column()
    fs_synonyms?: string[];

  @ApiProperty({ description: 'front side audio', nullable: true })
  @Column()
    fs_audio?: string;

  @ApiProperty({ description: 'back side language', nullable: false })
  @Column()
    bs_language: number;

  @ApiProperty({ description: 'back side value', nullable: false })
  @Column()
    bs_value: string;

  @ApiProperty({ description: 'back side value translation variants', nullable: true })
  @Column()
    bs_meaning_variants?: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true })
  @Column()
    bs_wrong_meanings?: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false })
  @Column()
    bs_transcription: string;

  @ApiProperty({ description: 'back side value synonyms', nullable: true })
  @Column()
    bs_synonyms?: string[];

  @ApiProperty({ description: 'back side audio', nullable: true })
  @Column()
    bs_audio?: string;

  @ApiProperty({ description: 'tags', nullable: true })
  @Column()
    tags?: string[];
}
