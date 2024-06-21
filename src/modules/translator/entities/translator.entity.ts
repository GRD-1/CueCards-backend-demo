import { ApiProperty } from '@nestjs/swagger';

export class TranslatorEntity {
  constructor(lang: string, value: string) {
    this.lang = lang;
    this.value = value;
  }

  @ApiProperty({ description: 'value language', nullable: false })
  lang: string;

  @ApiProperty({ description: 'the phrase or the word', nullable: false })
  value: string;
}
