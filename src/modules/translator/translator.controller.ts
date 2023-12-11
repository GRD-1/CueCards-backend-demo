import { Controller, Get, Param } from '@nestjs/common';

@Controller('translator')
export class TranslatorController {
  @Get()
  async get(@Param('lang') lang: string, @Param('val') val: string): Promise<string> {
    return 'word/sentence translation';
  }
}
