import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardEntity } from '@/modules/card/card.entity';
import { Type } from 'class-transformer';

export class GetCardDto {
  @ApiProperty({ description: 'page number' })
  @IsOptional()
  @IsNumber()
    page = 1;

  @ApiProperty({ description: 'number of entries per page' })
  @IsOptional()
  @IsNumber()
    pageSize = 20;
}

export class GetCardRespDto {
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
