import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
  @Get()
  async get(): Promise<string> {
    return 'some achievement statistics';
  }
}
