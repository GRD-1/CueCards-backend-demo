import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TagDto {
  @ApiProperty({ description: 'tag name', nullable: false })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class TagRespDto extends TagDto {
  @ApiProperty({ description: 'tag id', nullable: false, type: Number })
  readonly id: number;
  
  @ApiProperty({ description: 'user id', nullable: true, type: Number })
  readonly authorId?: string | null;
}

export class GetManyTagsDto {
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

  @ApiProperty({ description: 'tag name' })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ description: 'part of the tag name' })
  @IsOptional()
  readonly partOfName?: string;
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
