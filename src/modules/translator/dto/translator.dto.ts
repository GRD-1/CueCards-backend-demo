import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TranslatorDto {
  @ApiProperty({ description: 'value language', nullable: false })
  @IsString()
  lang: string;

  @ApiProperty({ description: 'the phrase or the word', nullable: false })
  @IsString()
  value: string;
}
