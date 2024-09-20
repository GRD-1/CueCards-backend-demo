import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsEntity } from '../settings/entities/settings.entity';
import { StatisticsService } from './statistics.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: SettingsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return this.statisticsService.findAll();
  }
}
