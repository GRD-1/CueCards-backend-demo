import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  USER_SELECT_OPTIONS,
  USER_WITH_CREDENTIALS_SELECT_OPTIONS,
} from '@/modules/prisma/repositories/select-options/user.select-options';
import { CredentialsEntity, UserEntity, UserWithCredentialsEntity } from '@/modules/user/user.entity';
import { IUser, IUserWithPassword } from '@/modules/user/user.interface';
import { DEFAULT_SETTINGS } from '@/modules/settings/settings.constants';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: IUserWithPassword): Promise<UserWithCredentialsEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const newUser = await this.prisma.user.create({
        select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
        data: userData,
      });

      await prisma.credentials.create({
        data: { userId: newUser.id, password: userData.password, lastPassword: userData.password },
      });

      await prisma.settings.create({
        data: { ...DEFAULT_SETTINGS, userId: newUser.id },
      });

      return newUser;
    });
  }

  async findOneByEmail(email?: string): Promise<UserWithCredentialsEntity | null> {
    const user = await this.prisma.user.findFirst({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      where: { email },
    });

    return user || null;
  }

  async findOneById(id: number): Promise<UserWithCredentialsEntity | null> {
    return this.prisma.user.findFirstOrThrow({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      where: {
        id,
      },
    });
  }

  async update(id: number, payload: Partial<IUser>): Promise<UserEntity> {
    return this.prisma.user.update({
      select: USER_SELECT_OPTIONS,
      data: payload,
      where: { id },
    });
  }

  async updatePassword(userId: number, lastPassword: string, password: string): Promise<CredentialsEntity> {
    return this.prisma.credentials.upsert({
      where: { userId },
      update: {
        version: { increment: 1 },
        lastPassword,
        password,
      },
      create: {
        userId,
        version: 1,
        lastPassword,
        password,
      },
    });
  }

  async getCredentials(userId: number): Promise<CredentialsEntity> {
    return this.prisma.credentials.findUniqueOrThrow({
      where: { userId },
    });
  }

  async delete(id: number): Promise<number> {
    const userId = await this.prisma.user.delete({
      select: { id: true },
      where: { id },
    });

    return userId.id;
  }
}
