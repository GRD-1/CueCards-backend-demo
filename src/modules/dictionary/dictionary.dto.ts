import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { TagRespDto } from '@/modules/tag/tag.dto';

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
  @ApiProperty({ description: 'array of tags', nullable: true, type: [TagRespDto] })
  @IsArray()
  @Type(() => TagRespDto)
  @Transform(({ value }) => value.map(tag => tag.tag), { toClassOnly: true })
    tags: TagRespDto[];

  @ApiProperty({ description: 'dictionary id', nullable: true })
    id: number;
}

export class GetManyDictionariesDto {
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
}

export class GetManyDictRespDto {
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

  @ApiProperty({ description: 'an array of dictionaries', nullable: false, type: [DictionaryRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DictionaryRespDto)
    dictionaries: DictionaryRespDto[];
}

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {}
