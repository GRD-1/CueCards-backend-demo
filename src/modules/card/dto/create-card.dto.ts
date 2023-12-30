import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'card identifier', nullable: true })
  @IsNumber()
    id?: number;

  @ApiProperty({ description: 'user identifier', nullable: true })
  @IsNumber()
    userId?: number;

  @ApiProperty({ description: 'front side language', nullable: false })
  @IsNumber()
    fs_language: number;

  @ApiProperty({ description: 'front side value', nullable: false })
  @IsString()
    fs_value: string;

  @ApiProperty({ description: 'front side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_meaning_variants?: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_wrong_meanings?: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false })
  @IsString()
    fs_transcription: string;

  @ApiProperty({ description: 'front side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_synonims?: string[];

  @ApiProperty({ description: 'front side audio', nullable: true })
  @IsString()
    fs_audio?: string;

  @ApiProperty({ description: 'back side language', nullable: false })
  @IsNumber()
    bs_language: number;

  @ApiProperty({ description: 'back side value', nullable: false })
  @IsString()
    bs_value: string;

  @ApiProperty({ description: 'back side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_meaning_variants?: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_wrong_meanings?: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false })
  @IsString()
    bs_transcription: string;

  @ApiProperty({ description: 'back side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_synonims?: string[];

  @ApiProperty({ description: 'back side audio', nullable: true })
  @IsString()
    bs_audio?: string;

  @ApiProperty({ description: 'tags', nullable: true })
  @IsArray()
  @IsString({ each: true })
    tags?: string[];
}
