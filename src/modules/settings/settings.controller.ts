import { Controller, Get, Patch } from '@nestjs/common';

@Controller('settings')
export class SettingsController {
  @Get()
  async get(): Promise<string> {
    return 'settings JSON';
  }

  @Patch()
  async patch(): Promise<string> {
    return 'app settings has been patched';
  }
}
