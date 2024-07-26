import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LanguageDto {
  @ApiProperty({ description: 'language name', nullable: false, example: 'italian' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'language name', nullable: false, example: 'it' })
  @IsString()
  @IsNotEmpty()
  readonly acronym: string;
}

export class LanguageRespDto extends LanguageDto {
  @ApiProperty({ description: 'language id', nullable: false, type: Number })
  readonly id: number;
}

export class GetManyLanguagesDto {
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

  @ApiProperty({ description: 'language name' })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ description: 'part of the language name' })
  @IsOptional()
  readonly partOfName?: string;
}

export class GetManyLanguagesRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
  readonly page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
  readonly pageSize: number;

  @ApiProperty({ description: 'number of records in the response', nullable: false })
  @IsNumber()
  readonly records: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
  readonly totalRecords: number;

  @ApiProperty({ description: 'an array of languages', nullable: false, type: [LanguageRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageRespDto)
  readonly languages: LanguageRespDto[];
}
