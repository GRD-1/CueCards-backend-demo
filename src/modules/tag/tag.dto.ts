import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TagDto {
  @ApiProperty({ description: 'tag name', nullable: false })
  @IsString()
  @IsNotEmpty()
    name: string;
}

export class TagRespDto extends TagDto {
  @ApiProperty({ description: 'user id', nullable: true, type: Number })
    authorId?: number | null;

  @ApiProperty({ description: 'tag id', nullable: false, type: Number })
    id: number;
}

export class GetManyTagsDto {
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

  @ApiProperty({ description: 'tag name' })
  @IsOptional()
    name?: string;
}

export class GetManyTagsRespDto {
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

  @ApiProperty({ description: 'an array of tags', nullable: false, type: [TagRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagRespDto)
    tags: TagRespDto[];
}
