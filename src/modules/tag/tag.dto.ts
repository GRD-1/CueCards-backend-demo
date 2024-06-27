import { IsArray, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TagEntity } from '@/modules/tag/tag.entity';

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
  @ApiProperty({ description: 'an array of tags', nullable: false, type: [TagEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagEntity)
    tags: TagEntity[];

  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
    totalRecords: number;
}

export class GetTagRespDto extends TagEntity {}
