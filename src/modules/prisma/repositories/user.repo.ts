import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  USER_SELECT_OPTIONS,
  USER_WITH_CREDENTIALS_SELECT_OPTIONS,
} from '@/modules/prisma/repositories/select-options/user.select-options';
import { CredentialsEntity, UserEntity, UserWithCredentialsEntity } from '@/modules/user/user.entity';
import { IUser, IUserWithPassword } from '@/modules/user/user.interface';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: IUserWithPassword): Promise<UserWithCredentialsEntity> {
    const { email, nickname, avatar, password } = userData;

    return this.prisma.user.create({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      data: {
        email,
        nickname,
        avatar,
        credentials: {
          create: {
            password,
          },
        },
        settings: { create: {} },
      },
    });
  }

  async findOneByEmail(email?: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      select: USER_SELECT_OPTIONS,
      where: { email },
    });

    return user || null;
  }

  async findOneWithCredentialsByEmail(email?: string): Promise<UserWithCredentialsEntity> {
    const user = await this.prisma.user.findFirstOrThrow({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      where: { email },
    });

    return user || null;
  }

  async findOneById(id: string): Promise<UserWithCredentialsEntity | null> {
    return this.prisma.user.findFirst({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      where: {
        id,
      },
    });
  }

  async findOneByIdOrThrow(id: string): Promise<UserWithCredentialsEntity> {
    return this.prisma.user.findFirstOrThrow({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      where: {
        id,
      },
    });
  }

  async update(id: string, payload: Partial<IUser>): Promise<UserEntity> {
    return this.prisma.user.update({
      select: USER_SELECT_OPTIONS,
      data: payload,
      where: { id },
    });
  }

  async confirm(email: string): Promise<UserWithCredentialsEntity> {
    return this.prisma.user.update({
      select: USER_WITH_CREDENTIALS_SELECT_OPTIONS,
      data: { confirmed: true },
      where: { email },
    });
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<CredentialsEntity> {
    return this.prisma.credentials.upsert({
      where: { userId },
      update: {
        version: { increment: 1 },
        password: newPassword,
        lastPassword: currentPassword,
      },
      create: {
        userId,
        version: 1,
        password: newPassword,
        lastPassword: currentPassword,
      },
    });
  }

  async delete(id: string): Promise<string> {
    const userId = await this.prisma.user.delete({
      select: { id: true },
      where: { id },
    });

    return userId.id;
  }
}
