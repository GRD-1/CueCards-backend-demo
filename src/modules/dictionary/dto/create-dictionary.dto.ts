import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CardReferenceDto {
  @ApiProperty({ description: 'card id', nullable: false })
  @IsNumber()
    cardId: number;

  @ApiProperty({ description: 'user id', nullable: false })
  @IsNumber()
    userId: number;

  @ApiProperty({ description: 'front side value', nullable: false })
  @IsString()
    fs_value: string;

  @ApiProperty({ description: 'back side value', nullable: false })
  @IsString()
    bs_value: string;

  @ApiProperty({ description: 'hide the card front side value from the training list', nullable: false })
  @IsBoolean()
    fsHide?: boolean;

  @ApiProperty({ description: 'hide the card back side value from the training list', nullable: false })
  @IsBoolean()
    bsHide?: boolean;
}

export class CreateDictionaryDto {
  @ApiProperty({ description: 'dictionary id', nullable: true })
  @IsNumber()
    id?: number;

  @ApiProperty({ description: 'user identifier', nullable: true })
  @IsNumber()
    userId?: number;

  @ApiProperty({ description: 'dictionary title', nullable: false })
  @IsString()
    title: string;

  @ApiProperty({ description: 'dictionary tags', nullable: false })
  @IsArray()
  @IsString({ each: true })
    tags?: string[];

  @ApiProperty({ description: 'The card belongs to the dictionary', nullable: false })
  @IsArray()
  @ValidateNested()
  @Type(() => CardReferenceDto)
    cardReferences?: CardReferenceDto[];
}
