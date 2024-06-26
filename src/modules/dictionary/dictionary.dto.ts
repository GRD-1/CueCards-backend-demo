import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

export class CreateDictionaryDto extends DictionaryEntity {}

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

  @ApiProperty({ description: 'search records by user' })
  @IsOptional()
    byUser?: boolean;

  @ApiProperty({ description: 'dictionary title' })
  @IsOptional()
    title?: string;
}

export class GetManyDictRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'the total number of records', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of dictionaries', nullable: false, type: [DictionaryEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DictionaryEntity)
    dictionaries: DictionaryEntity[];
}

export class GetDictionaryRespDto extends DictionaryEntity {}

export class UpdateDictionaryDto extends PartialType(DictionaryEntity) {}
