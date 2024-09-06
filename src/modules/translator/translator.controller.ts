import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/guards/auth.guard';
import { TranslatorService } from './translator.service';

@ApiTags('translator')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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
