import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CardEntity } from '@/modules/card/card.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCardDto extends CardEntity {}

export class GetManyCardsDto {
  @ApiProperty({ description: 'page number' })
  @IsOptional()
  @IsNumber()
    page = 1;

  @ApiProperty({ description: 'number of entries per page' })
  @IsOptional()
  @IsNumber()
    pageSize = 20;
}

export class GetManyCardsRespDto {
  @ApiProperty({ description: 'an array of cards', nullable: false, type: [CardEntity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardEntity)
    cards: CardEntity[];

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

export class GetCardRespDto extends CardEntity {}

export class UpdateCardDto extends PartialType(CardEntity) {}
