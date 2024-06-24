import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

export class CreateDictionaryDto extends DictionaryEntity {}

export class GetManyDictionariesDto {
  @ApiProperty({ description: 'page number' })
  @IsOptional()
  @IsNumber()
    page = 1;

  @ApiProperty({ description: 'number of entries per page' })
  @IsOptional()
  @IsNumber()
    pageSize = 20;
}

export class GetManyDictionariesRespDto {
  @ApiProperty({ description: 'an array of dictionaries', nullable: false, type: [DictionaryEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DictionaryEntity)
    cards: DictionaryEntity[];

  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
    numberOfRecords: number;
}

export class GetDictionaryRespDto extends DictionaryEntity {}

export class UpdateDictionaryDto extends PartialType(DictionaryEntity) {}
