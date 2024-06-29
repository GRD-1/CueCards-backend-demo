import { IsArray, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CardEntity } from '@/modules/card/card.entity';
import { PartialType } from '@nestjs/mapped-types';
import { TagEntity } from '@/modules/tag/tag.entity';

export class CreateCardDto extends CardEntity {
  @ApiProperty({ description: 'tag id array', nullable: true })
  @IsArray()
  @IsInt({ each: true })
    tags: number[];
}

export class CardRespDto extends CardEntity {
  @ApiProperty({ description: 'Card tags', nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagEntity)
    tags: TagEntity[];
}

export class GetManyCardsDto {
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

  @ApiProperty({ description: 'card value' })
  @IsOptional()
    value?: string;
}

export class GetManyCardsRespDto {
  @ApiProperty({ description: 'page number', nullable: false })
  @IsNumber()
    page: number;

  @ApiProperty({ description: 'number of entries per page', nullable: false })
  @IsNumber()
    pageSize: number;

  @ApiProperty({ description: 'the total number of entries', nullable: false })
  @IsNumber()
    totalRecords: number;

  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardRespDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardRespDto)
    cards: CardRespDto[];
}

export class GetCardRespDto extends CardRespDto {}

export class UpdateCardDto extends PartialType(CardRespDto) {}
