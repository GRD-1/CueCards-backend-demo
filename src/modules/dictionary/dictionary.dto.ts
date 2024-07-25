import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { TagRespDto } from '@/modules/tag/tag.dto';
import { CardDto, CardWithSettingsDto } from '@/modules/card/card.dto';

export class DictionaryDto {
  @ApiProperty({ description: 'user id', nullable: true })
    authorId: number | null;

  @ApiProperty({ description: 'dictionary name', nullable: false })
  @IsString()
    name: string;
}

export class CreateDictionaryDto extends DictionaryDto {
  @ApiProperty({ description: 'array of tags id', nullable: true, example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
    tags: number[];
}

export class DictionaryRespDto extends DictionaryDto {
  @ApiProperty({ description: 'dictionary id', nullable: true })
    id: number;
}

export class WithCardsRespDto extends DictionaryRespDto {
  @ApiProperty({ description: 'Array of cards', type: [CardDto], nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
    cards: CardDto[];
}

export class WithTagsRespDto extends DictionaryRespDto {
  @ApiProperty({ description: 'Array of tags', type: [TagRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagRespDto)
  @Transform(({ value }) => value.map(tag => tag.tag), { toClassOnly: true })
    tags: TagRespDto[];
}

export class WithTagsAndCardsRespDto extends WithCardsRespDto {
  @ApiProperty({ description: 'Array of tags', type: [TagRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagRespDto)
    tags: TagRespDto[];
}

export class WithTagsAndCardSettingsRespDto extends DictionaryRespDto {
  @ApiProperty({ description: 'Array of tags', type: [TagRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagRespDto)
    tags: TagRespDto[];

  @ApiProperty({ description: 'Array of cards', type: [CardWithSettingsDto], nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
    cards: CardWithSettingsDto[];
}

export class GetListDto {
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
    byUser?: boolean;

  @ApiProperty({ description: 'dictionary name' })
  @IsOptional()
    name?: string;

  @ApiProperty({ description: 'part of the dictionary name' })
  @IsOptional()
    partOfName?: string;
}

export class GetListRespDto {
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

  @ApiProperty({ description: 'an array of dictionaries', nullable: false, type: [WithTagsRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WithTagsRespDto)
    dictionaries: WithTagsRespDto[];
}

export class GetListWithFirstRespDto extends GetListRespDto {
  @ApiProperty({ description: 'the first dictionary in a list', nullable: false, type: WithTagsAndCardsRespDto })
  @Type(() => WithTagsAndCardsRespDto)
    firstDictionary: WithTagsAndCardsRespDto;
}

export class GetSettingsWithFRespDto extends GetListRespDto {
  @ApiProperty({ description: 'the first dictionary in a list', nullable: false, type: WithTagsAndCardSettingsRespDto })
  @Type(() => WithTagsAndCardSettingsRespDto)
    firstDictionary: WithTagsAndCardSettingsRespDto;
}

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {}
