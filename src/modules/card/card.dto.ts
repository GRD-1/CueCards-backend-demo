import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { TagRespDto } from '@/modules/tag/tag.dto';
import { CardStatsDto } from '@/modules/card-statistics/card-statistics.dto';

export class CardDto {
  @ApiProperty({ description: 'user id', nullable: true, example: 1 })
    authorId: number | null;

  @ApiProperty({ description: 'front side language', nullable: false, example: 'en' })
  @IsString()
    fsLanguage: string;

  @ApiProperty({ description: 'front side value', nullable: false, example: 'text text text' })
  @IsString()
    fsValue: string;

  @ApiProperty({ description: 'description for the front side value: proverb, swearing e.t.c', example: 'text' })
  @IsString()
    fsDescription: string | null;

  @ApiProperty({ description: 'front side value translation variants', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    fsMeaningVariants: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    fsWrongMeanings: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false, example: 'text' })
  @IsString()
    fsTranscription: string | null;

  @ApiProperty({ description: 'front side value synonyms', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    fsSynonyms: string[];

  @ApiProperty({ description: 'front side audio', nullable: true, example: 'path/to/file' })
  @IsString()
    fsAudio: string | null;

  @ApiProperty({ description: 'hint that helps to remember the translation', nullable: true, example: 'hint' })
  @IsString()
    fsHint: string | null;

  @ApiProperty({ description: 'back side language', nullable: false, example: 'ru' })
  @IsString()
    bsLanguage: string;

  @ApiProperty({ description: 'back side value', nullable: false, example: 'text' })
  @IsString()
    bsValue: string;

  @ApiProperty({ description: 'description for the back side value: proverb, swearing e.t.c', example: 'text' })
  @IsString()
    bsDescription: string | null;

  @ApiProperty({ description: 'back side value translation variants', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    bsMeaningVariants: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    bsWrongMeanings: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false, example: 'text' })
  @IsString()
    bsTranscription: string | null;

  @ApiProperty({ description: 'back side value synonyms', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
    bsSynonyms: string[];

  @ApiProperty({ description: 'back side audio', nullable: true, example: 'path/to/file' })
    bsAudio: string | null;

  @ApiProperty({ description: 'back side hint which helps to remember the translation', example: 'hint' })
    bsHint: string | null;
}

export class CreateCardDto extends CardDto {
  @ApiProperty({ description: 'array of tags id', nullable: true, example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
    tags: number[];
}

export class CardRespDto extends CardDto {
  @ApiProperty({ description: 'card id', nullable: true })
    id: number;

  @ApiProperty({ description: 'the date when the card were created', nullable: false, type: Date })
  @IsDate()
    createdAt: Date;

  @ApiProperty({ description: 'the date when the card were updated', nullable: false, type: Date })
  @IsDate()
    updatedAt: Date;

  @ApiProperty({ description: 'the mark that the card will be deleted', nullable: false, type: Boolean })
  @IsBoolean()
    deleteMark: boolean;
}

export class CardWithTagsRespDto extends CardRespDto {
  @ApiProperty({ description: 'array of tags', nullable: true, type: [TagRespDto] })
  @IsArray()
  @Type(() => TagRespDto)
  @Transform(({ value }) => value.map(tag => tag.tag), { toClassOnly: true })
    tags: TagRespDto[];
}

export class GetManyCardsDto {
  @ApiProperty({ description: 'page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
    page?: number;

  @ApiProperty({ description: 'number of records per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
    pageSize?: number;

  @ApiProperty({ description: 'search for records by user' })
  @IsOptional()
  @IsBoolean()
    byUser?: boolean;

  @ApiProperty({ description: 'card value' })
  @IsOptional()
    value?: string;

  @ApiProperty({ description: 'part of the card value' })
  @IsOptional()
    partOfValue?: string;
}

export class GetManyCardsRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of records per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'number of records in the response', nullable: false })
  @IsNumber()
    records: number;

  @ApiProperty({ description: 'the total number of records', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardRespDto)
    cards: CardRespDto[];
}

export class CardWithSettingsDto {
  @ApiProperty({ description: 'card id', nullable: false })
  @IsInt()
    id: number;

  @ApiProperty({ description: 'author id', nullable: false })
  @IsInt()
    authorId: number;

  @ApiProperty({ description: 'front side value', nullable: false, example: 'text text text' })
  @IsString()
    fsValue: string;

  @ApiProperty({ description: 'back side value', nullable: false, example: 'text' })
  @IsString()
    bsValue: string;

  @ApiProperty({ description: 'the card statistics', nullable: true, type: CardStatsDto })
  @IsArray()
  @Type(() => CardStatsDto)
  @Transform(({ value }) => (value[0] ? value[0] : {}), { toClassOnly: true })
    statistics: CardStatsDto | null;

  @ApiProperty({ description: 'is the card hidden in the dictionary settings', nullable: true, type: Boolean })
  @IsArray()
  @Type(() => Boolean)
  @Transform(({ value }) => (!!value[0]))
    cardIsHidden: boolean;
}

export class GetWithSettingsRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of records per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'number of records in the response', nullable: false })
  @IsNumber()
    records: number;

  @ApiProperty({ description: 'the total number of records matching this query', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardWithSettingsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardWithSettingsDto)
    cards: CardWithSettingsDto[];
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}
