import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsEntity } from '../settings/entities/settings.entity';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  @Get()
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: SettingsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async get(): Promise<string> {
    return 'some achievement statistics';
  }
}
