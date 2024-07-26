import { IsArray, IsDate, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StatisticsDto {
  @ApiProperty({ description: 'dictionary id', nullable: false, type: Number })
  @IsInt()
  @Min(1)
  readonly dictionaryId: number;

  @ApiProperty({ description: 'the total answers number', nullable: false, type: Number })
  @IsInt()
  readonly totalAnswers: number;

  @ApiProperty({ description: 'the correct answers number', nullable: false, type: Number })
  @IsInt()
  readonly correctAnswers: number;

  @ApiProperty({ description: 'the training time in milliseconds', nullable: false, type: Number })
  @IsInt()
  readonly trainingTime: number;

  @ApiProperty({ description: 'the number of used hints', nullable: false, type: Number })
  @IsInt()
  readonly hintsCount: number;
}

export class StatisticsRespDto extends StatisticsDto {
  @ApiProperty({ description: 'record id', nullable: true, type: Number })
  readonly id: number | null;

  @ApiProperty({ description: 'user id', nullable: false, type: Number })
  readonly userId: number;
}

export class GetManyStatsDto {
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

  @ApiProperty({ description: 'dictionary id' })
  @IsOptional()
  @IsInt()
  readonly dictionaryId?: number;

  @ApiProperty({ description: 'the date and time of a selection start' })
  @IsOptional()
  @IsDate()
  readonly selectionStart?: Date;

  @ApiProperty({ description: 'the date and time of a selection end' })
  @IsOptional()
  @IsDate()
  readonly selectionEnd?: Date;
}

export class GetManyStatsRespDto {
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

  @ApiProperty({ description: 'an array of statistics', nullable: false, type: [StatisticsRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticsRespDto)
  readonly statistics: StatisticsRespDto[];
}

export class GetLastResultsDto {
  @ApiProperty({ description: 'dictionary id' })
  @IsOptional()
  @IsInt()
  readonly dictionaryId?: number;
}
