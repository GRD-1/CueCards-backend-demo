import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  USER_SELECT_OPTIONS,
  USER_WITH_PASSWORD_SELECT_OPTIONS,
} from '@/modules/prisma/repositories/select-options/user.select-options';
import { UserEntity, UserWithPasswordEntity } from '@/modules/user/user.entity';
import { UserInterface } from '@/modules/user/user.interface';
import { DEFAULT_SETTINGS } from '@/modules/settings/settings.constants';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: UserInterface): Promise<number> {
    return this.prisma.$transaction(async (prisma) => {
      const newUser = await this.prisma.user.create({
        select: { id: true },
        data: userData,
      });

      await prisma.settings.create({
        data: { ...DEFAULT_SETTINGS, userId: newUser.id },
      });

      return newUser?.id;
    });
  }

  async findOneByEmail(email?: string): Promise<UserWithPasswordEntity | null> {
    const user = await this.prisma.user.findFirst({
      select: USER_WITH_PASSWORD_SELECT_OPTIONS,
      where: { email },
    });

    return user || null;
  }

  async findOneById(id: number): Promise<UserEntity> {
    return this.prisma.user.findFirstOrThrow({
      select: USER_SELECT_OPTIONS,
      where: {
        id,
      },
    });
  }

  async update(id: number, payload: Partial<UserInterface>): Promise<UserEntity> {
    return this.prisma.user.update({
      select: USER_SELECT_OPTIONS,
      data: payload,
      where: { id },
    });
  }
}
