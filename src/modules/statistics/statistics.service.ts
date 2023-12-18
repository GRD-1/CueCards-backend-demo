import { Injectable } from '@nestjs/common';

@Injectable()
export class StatisticsService {
  async findAll(): Promise<string> {
    return 'some achievement statistics';
  }
}
