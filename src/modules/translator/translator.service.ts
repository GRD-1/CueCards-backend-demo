import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslatorService {
  async findOne(lang?: string, value?: string): Promise<string> {
    return `lang = ${lang}, value = ${value}, translation = ...`;
  }
}
