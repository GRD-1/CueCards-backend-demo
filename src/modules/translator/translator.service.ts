import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class TranslatorService {
  async findOne(@Query('lang') lang: string, @Query('value') value: string): Promise<string> {
    return 'word/phrase translation';
  }
}
