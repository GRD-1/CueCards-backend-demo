import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CardReferenceDto {
  @IsNumber()
    cardId: number;

  @IsNumber()
    userId: number;

  @IsString()
    fs_value: string;

  @IsString()
    bs_value: string;

  @IsBoolean()
    fsHide?: boolean;

  @IsBoolean()
    bsHide?: boolean;
}

export class CreateDictionaryDto {
  @IsNumber()
    dictionaryId: number;

  @IsString()
    title: string;

  @IsNumber()
    owner: number;

  @IsArray()
  @IsString({ each: true })
    tags?: string[];

  @IsArray()
  @ValidateNested()
  @Type(() => CardReferenceDto)
    cardReferences?: CardReferenceDto[];
}
