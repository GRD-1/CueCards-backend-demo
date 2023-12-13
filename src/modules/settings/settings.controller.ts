import { Body, Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsEntity } from './entities/settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  @Get()
  @ApiOperation({ summary: 'Get settings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: SettingsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return 'settings JSON';
  }

  @Patch()
  @ApiOperation({ summary: 'Update settings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: SettingsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Body() dto: UpdateSettingsDto): Promise<string> {
    return 'app settings has been updated';
  }
}
