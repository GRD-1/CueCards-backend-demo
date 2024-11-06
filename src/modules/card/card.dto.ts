import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt, IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { TagRespDto } from '@/modules/tag/tag.dto';
import { CardStatsDto } from '@/modules/card-statistics/card-statistics.dto';

export class CardDto {
  @ApiProperty({ description: 'front side language', nullable: false, example: 'en' })
  @IsString()
  readonly fsLanguage: string;

  @ApiProperty({ description: 'front side value', nullable: false, example: 'text text text' })
  @IsString()
  readonly fsValue: string;

  @ApiProperty({ description: 'description for the front side value: proverb, swearing e.t.c', example: 'text' })
  @IsString()
  readonly fsDescription: string | null;

  @ApiProperty({ description: 'front side value translation variants', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly fsMeaningVariants: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly fsWrongMeanings: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false, example: 'text' })
  @IsString()
  readonly fsTranscription: string | null;

  @ApiProperty({ description: 'front side value synonyms', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly fsSynonyms: string[];

  @ApiProperty({ description: 'front side audio', nullable: true, example: 'path/to/file' })
  @IsString()
  readonly fsAudio: string | null;

  @ApiProperty({ description: 'hint that helps to remember the translation', nullable: true, example: 'hint' })
  @IsString()
  readonly fsHint: string | null;

  @ApiProperty({ description: 'back side language', nullable: false, example: 'ru' })
  @IsString()
  readonly bsLanguage: string;

  @ApiProperty({ description: 'back side value', nullable: false, example: 'text' })
  @IsString()
  readonly bsValue: string;

  @ApiProperty({ description: 'description for the back side value: proverb, swearing e.t.c', example: 'text' })
  @IsString()
  readonly bsDescription: string | null;

  @ApiProperty({ description: 'back side value translation variants', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly bsMeaningVariants: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly bsWrongMeanings: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false, example: 'text' })
  @IsString()
  readonly bsTranscription: string | null;

  @ApiProperty({ description: 'back side value synonyms', nullable: true, example: ['var1', 'var2'] })
  @IsArray()
  @IsString({ each: true })
  readonly bsSynonyms: string[];

  @ApiProperty({ description: 'back side audio', nullable: true, example: 'path/to/file' })
  @IsString()
  readonly bsAudio: string | null;

  @ApiProperty({ description: 'back side hint which helps to remember the translation', example: 'hint' })
  @IsString({ each: true })
  readonly bsHint: string | null;
}

export class CardListItemRespDto {
  @ApiProperty({ description: 'card id', nullable: true })
  readonly id: number;

  @ApiProperty({ description: 'user id', nullable: true, example: 1 })
  readonly authorId: string;

  @ApiProperty({ description: 'front side language', nullable: false, example: 'en' })
  @IsString()
  readonly fsLanguage: string;

  @ApiProperty({ description: 'front side value', nullable: false, example: 'text text text' })
  @IsString()
  readonly fsValue: string;

  @ApiProperty({ description: 'back side language', nullable: false, example: 'ru' })
  @IsString()
  readonly bsLanguage: string;

  @ApiProperty({ description: 'back side value', nullable: false, example: 'text' })
  @IsString()
  readonly bsValue: string;

  @ApiProperty({ description: 'array of tags', nullable: true, type: [TagRespDto] })
  @IsArray()
  @Type(() => TagRespDto)
  @Transform(({ value }) => value.map(tag => tag.tag), { toClassOnly: true })
  readonly tags: TagRespDto[];
}

export class CreateCardDto extends CardDto {
  @ApiProperty({ description: 'array of tags id', nullable: true, example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  readonly tags: number[];
}

export class CardRespDto extends CardDto {
  @ApiProperty({ description: 'card id', nullable: true })
  @IsInt()
  readonly id: number;

  @ApiProperty({ description: 'user id', nullable: false, example: 1 })
  @IsInt()
  readonly authorId: string;

  @ApiProperty({ description: 'the date when the card were created', nullable: false, type: Date })
  @IsDate()
  readonly createdAt: Date;

  @ApiProperty({ description: 'the date when the card were updated', nullable: false, type: Date })
  @IsDate()
  readonly updatedAt: Date;

  @ApiProperty({ description: 'the mark that the card will be deleted', nullable: false, type: Boolean })
  @IsBoolean()
  readonly deleteMark: boolean;
}

export class CardWithTagsRespDto extends CardRespDto {
  @ApiProperty({ description: 'array of tags', nullable: true, type: [TagRespDto] })
  @IsArray()
  @Type(() => TagRespDto)
  @Transform(({ value }) => value.map(tag => tag.tag), { toClassOnly: true })
  readonly tags: TagRespDto[];
}

export class GetCardListDto {
  @ApiProperty({ description: 'A card front side language', nullable: false, example: 'ru' })
  @IsString()
  @IsNotEmpty()
  readonly fsLanguage: string;

  @ApiProperty({ description: 'A card back side language', nullable: false, example: 'en' })
  @IsString()
  @IsNotEmpty()
  readonly bsLanguage: string;

  @ApiProperty({ description: 'page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number;

  @ApiProperty({ description: 'number of records per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly pageSize?: number;

  @ApiProperty({ description: 'search for records by user' })
  @IsOptional()
  @IsBoolean()
  readonly byUser?: boolean;

  @ApiProperty({ description: 'card value' })
  @IsOptional()
  readonly value?: string;

  @ApiProperty({ description: 'part of the card value' })
  @IsOptional()
  readonly partOfValue?: string;
}

export class GetCardListRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
  readonly page: number;

  @ApiProperty({ description: 'number of records per page', nullable: false })
  @IsNumber()
  readonly pageSize: number;

  @ApiProperty({ description: 'number of records in the response', nullable: false })
  @IsNumber()
  readonly records: number;

  @ApiProperty({ description: 'the total number of records', nullable: false })
  @IsNumber()
  readonly totalRecords: number;

  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardListItemRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardListItemRespDto)
  readonly cards: CardListItemRespDto[];
}

export class GetCardListWithFRespDto extends GetCardListRespDto {
  @ApiProperty({ description: 'the first card in a list', nullable: false, type: CardWithTagsRespDto })
  @Type(() => CardWithTagsRespDto)
  readonly firstCard: CardWithTagsRespDto;
}

export class CardWithSettingsDto {
  @ApiProperty({ description: 'card id', nullable: false })
  @IsInt()
  readonly id: number;

  @ApiProperty({ description: 'author id', nullable: false })
  @IsInt()
  readonly authorId: string;

  @ApiProperty({ description: 'front side value', nullable: false, example: 'text text text' })
  @IsString()
  readonly fsValue: string;

  @ApiProperty({ description: 'back side value', nullable: false, example: 'text' })
  @IsString()
  readonly bsValue: string;

  @ApiProperty({ description: 'the card statistics', nullable: true, type: CardStatsDto })
  @IsArray()
  @Type(() => CardStatsDto)
  @Transform(({ value }) => (value[0] ? value[0] : {}), { toClassOnly: true })
  readonly statistics: CardStatsDto | null;

  @ApiProperty({ description: 'is the card hidden in the dictionary settings', nullable: true, type: Boolean })
  @IsArray()
  @Type(() => Boolean)
  @Transform(({ value }) => (!!value[0]))
  readonly cardIsHidden: boolean;
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}
