import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SettingsEntity } from '@/modules/settings/settings.entity';
import { SettingsInterface } from '@/modules/settings/settings.interface';
import { SETTINGS_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/settings.select-options';

@Injectable()
export class SettingsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string): Promise<SettingsEntity | null> {
    return this.prisma.settings.findFirst({
      select: SETTINGS_SELECT_OPTIONS,
      where: { userId },
    });
  }

  async updateSettings(userId: string, payload: Partial<SettingsInterface>): Promise<SettingsEntity> {
    console.log('\nrepo payload:', payload, '\n');

    return this.prisma.settings.update({
      select: SETTINGS_SELECT_OPTIONS,
      where: { userId },
      data: {
        ...payload,
      },
    });
  }

  async resetSettings(userId: string): Promise<SettingsEntity> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.settings.delete({
        where: { userId },
      });

      return prisma.settings.create({
        data: { userId },
      });
    });
  }
}
