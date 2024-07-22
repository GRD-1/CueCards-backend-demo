import { IsArray, IsDate, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StatisticsDto {
  @ApiProperty({ description: 'dictionary id', nullable: false, type: Number })
  @IsInt()
  @Min(1)
    dictionaryId: number;

  @ApiProperty({ description: 'the total answers number', nullable: false, type: Number })
  @IsInt()
    totalAnswers: number;

  @ApiProperty({ description: 'the correct answers number', nullable: false, type: Number })
  @IsInt()
    correctAnswers: number;

  @ApiProperty({ description: 'the training time in milliseconds', nullable: false, type: Number })
  @IsInt()
    trainingTime: number;

  @ApiProperty({ description: 'the number of used hints', nullable: false, type: Number })
  @IsInt()
    hintsCount: number;
}

export class StatisticsRespDto extends StatisticsDto {
  @ApiProperty({ description: 'record id', nullable: true, type: Number })
    id: number | null;

  @ApiProperty({ description: 'user id', nullable: false, type: Number })
    userId: number;
}

export class GetManyStatsDto {
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

  @ApiProperty({ description: 'dictionary id' })
  @IsOptional()
  @IsInt()
    dictionaryId?: number;

  @ApiProperty({ description: 'the date and time of a selection start' })
  @IsOptional()
  @IsDate()
    selectionStart?: Date;

  @ApiProperty({ description: 'the date and time of a selection end' })
  @IsOptional()
  @IsDate()
    selectionEnd?: Date;
}

export class GetManyStatsRespDto {
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

  @ApiProperty({ description: 'an array of statistics', nullable: false, type: [StatisticsRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticsRespDto)
    statistics: StatisticsRespDto[];
}

export class GetLastResultsDto {
  @ApiProperty({ description: 'dictionary id' })
  @IsOptional()
  @IsInt()
    dictionaryId?: number;
}
