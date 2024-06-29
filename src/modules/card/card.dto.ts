import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { TagRespDto } from '@/modules/tag/tag.dto';

export class CardDto {
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

  // @ApiProperty({ description: 'creation date', nullable: false })
  //   createdAt: Date;
  //
  // @ApiProperty({ description: 'update date', nullable: false })
  //   updatedAt: Date;
  //
  // @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
  //   deleteMark: boolean;
}

export class CreateCardDto extends CardDto {
  @ApiProperty({ description: 'array of tags id', nullable: true })
  @IsArray()
  @IsInt({ each: true })
    tags: number[];
}

export class CardRespDto extends CardDto {
  @ApiProperty({ description: 'card id', nullable: true })
    id: number;

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

  @ApiProperty({ description: 'search records by user' })
  @IsOptional()
    byUser?: boolean;

  @ApiProperty({ description: 'card value' })
  @IsOptional()
    value?: string;
}

export class GetManyCardsRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardRespDto)
    cards: CardRespDto[];
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}
