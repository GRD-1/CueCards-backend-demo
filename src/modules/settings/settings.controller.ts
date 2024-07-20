import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsRespDto, UpdateSettingsDto } from '@/modules/settings/settings.dto';
import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { SettingsService } from '@/modules/settings/settings.service';
import { UserId } from '@/modules/user/decorators/user-id.decorator';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get the application settings' })
  @ApiOkResponse({ description: 'Successful request', type: SettingsRespDto })
  async getSettings(@UserId() userId: number): Promise<SettingsRespDto | null> {
    return this.settingsService.getSettings(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the application settings' })
  @ApiBody({ type: UpdateSettingsDto, examples: { example1: { value: { notifications: true, hints: true } } } })
  @ApiOkResponse({ description: 'The settings have been updated successfully', type: SettingsRespDto })
  async updateSettings(@Body() payload: UpdateSettingsDto, @UserId() userId: number): Promise<SettingsRespDto> {
    console.log('\ncontroller payload:', payload, '\n');

    return this.settingsService.updateSettings(userId, payload);
  }

  @Put('reset')
  @ApiOperation({ summary: 'Reset the application settings' })
  @ApiOkResponse({ description: 'The settings have been reset', type: SettingsRespDto })
  async resetSettings(@UserId() userId: number): Promise<SettingsRespDto> {
    return this.settingsService.resetSettings(userId);
  }
}
