import { Injectable } from '@nestjs/common';
import { SettingsRepo } from '@/modules/prisma/repositories/settings.repo';
import { SettingsEntity } from '@/modules/settings/settings.entity';
import { SettingsInterface } from '@/modules/settings/settings.interface';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepo: SettingsRepo) {}

  async getSettings(userId: string): Promise<SettingsEntity | null> {
    return this.settingsRepo.getSettings(userId);
  }

  async updateSettings(userId: string, payload: Partial<SettingsInterface>): Promise<SettingsEntity> {
    return this.settingsRepo.updateSettings(userId, payload);
  }

  async resetSettings(userId: string): Promise<SettingsEntity> {
    return this.settingsRepo.resetSettings(userId);
  }
}
