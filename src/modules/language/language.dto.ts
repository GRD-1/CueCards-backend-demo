import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LanguageDto {
  @ApiProperty({ description: 'language name', nullable: false, example: 'italian' })
  @IsString()
  @IsNotEmpty()
    name: string;

  @ApiProperty({ description: 'language name', nullable: false, example: 'it' })
  @IsString()
  @IsNotEmpty()
    acronym: string;
}

export class LanguageRespDto extends LanguageDto {
  @ApiProperty({ description: 'language id', nullable: false, type: Number })
    id: number;
}

export class GetManyLanguagesDto {
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

  @ApiProperty({ description: 'language name' })
  @IsOptional()
    name?: string;

  @ApiProperty({ description: 'part of the language name' })
  @IsOptional()
    partOfName?: string;
}

export class GetManyLanguagesRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'number of records in the response', nullable: false })
  @IsNumber()
    records: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of languages', nullable: false, type: [LanguageRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageRespDto)
    languages: LanguageRespDto[];
}
