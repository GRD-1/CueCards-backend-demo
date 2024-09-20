import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

export class TagLanguages {
  @ApiProperty({ description: 'A tag front side language', nullable: false, example: 'ru' })
  @IsString()
  @IsNotEmpty()
  readonly fsLanguage: string;

  @ApiProperty({ description: 'A tag back side language', nullable: false, example: 'en' })
  @IsString()
  @IsNotEmpty()
  readonly bsLanguage: string;
}

export class TagDto extends TagLanguages {
  @ApiProperty({ description: 'tag front side value', nullable: false })
  @IsString()
  @IsNotEmpty()
  readonly fsValue: string;

  @ApiProperty({ description: 'tag back side value', nullable: false })
  @IsString()
  @IsNotEmpty()
  readonly bsValue: string;
}

export class TagRespDto extends TagDto {
  @ApiProperty({ description: 'tag id', nullable: false, type: Number })
  readonly id: number;
  
  @ApiProperty({ description: 'user id', nullable: true, type: String })
  readonly authorId: string;
}

export class GetManyTagsDto extends TagLanguages {
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

  @ApiProperty({ description: 'search records by user' })
  @IsOptional()
  readonly byUser?: boolean;

  @ApiProperty({ description: 'tag value' })
  @IsOptional()
  readonly value?: string;

  @ApiProperty({ description: 'part of the tag value' })
  @IsOptional()
  readonly partOfValue?: string;
}

export class GetManyTagsRespDto {
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

  @ApiProperty({ description: 'an array of tags', nullable: false, type: [TagRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagRespDto)
  readonly tags: TagRespDto[];
}

export class UpdTagDto extends PartialType(TagDto) {}
