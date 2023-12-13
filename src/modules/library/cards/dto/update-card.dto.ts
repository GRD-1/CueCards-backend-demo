import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiProperty({ description: 'The front side language', nullable: false })
  @IsNumber()
    fs_language: number;

  @ApiProperty({ description: 'The front side value', nullable: false })
  @IsString()
    fs_value: string;

  @ApiProperty({ description: 'The front side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_meaning_variants?: string[];

  @ApiProperty({ description: 'The front side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_wrong_meanings?: string[];

  @ApiProperty({ description: 'The front side value transcription', nullable: false })
  @IsString()
    fs_transcription: string;

  @ApiProperty({ description: 'The front side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    fs_synonims?: string[];

  @ApiProperty({ description: 'The front side audio', nullable: true })
  @IsString()
    fs_audio?: string;

  @ApiProperty({ description: 'The back side language', nullable: false })
  @IsNumber()
    bs_language: number;

  @ApiProperty({ description: 'The back side value', nullable: false })
  @IsString()
    bs_value: string;

  @ApiProperty({ description: 'The back side value translation variants', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_meaning_variants?: string[];

  @ApiProperty({ description: 'The back side wrong value meanings', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_wrong_meanings?: string[];

  @ApiProperty({ description: 'The back side value transcription', nullable: false })
  @IsString()
    bs_transcription: string;

  @ApiProperty({ description: 'The back side value synonyms', nullable: true })
  @IsArray()
  @IsString({ each: true })
    bs_synonims?: string[];

  @ApiProperty({ description: 'The back side audio', nullable: true })
  @IsString()
    bs_audio?: string;

  @ApiProperty({ description: 'The tags', nullable: true })
  @IsArray()
  @IsString({ each: true })
    tags?: string[];
}
