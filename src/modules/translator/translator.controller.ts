import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TranslatorService } from './translator.service';

@ApiTags('translator')
@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Get()
  @ApiOperation({ summary: 'Get the phrase translation' })
  @ApiQuery({ name: 'lang', required: true, description: 'value language' })
  @ApiQuery({ name: 'value', required: true, description: 'the phrase or the word' })
  async findOne(@Query('lang') lang: string, @Query('value') value: string): Promise<string> {
    return this.translatorService.findOne(lang, value);
  }
}
