import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  async findAll(): Promise<string> {
    return 'settings JSON';
  }

  async update(dto: UpdateSettingsDto): Promise<string> {
    return 'app settings has been updated';
  }
}
