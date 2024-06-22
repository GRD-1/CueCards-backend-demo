import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardEntity } from '../card/card.entity';
import { TranslatorService } from './translator.service';

@ApiTags('translator')
@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Get()
  @ApiOperation({ summary: 'Get the phrase translation' })
  @ApiQuery({ name: 'lang', required: true, description: 'value language' })
  @ApiQuery({ name: 'value', required: true, description: 'the phrase or the word' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CardEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Query('lang') lang: string, @Query('value') value: string): Promise<string> {
    return this.translatorService.findOne(lang, value);
  }
}
