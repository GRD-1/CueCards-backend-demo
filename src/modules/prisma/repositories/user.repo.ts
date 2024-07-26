import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  USER_SELECT_OPTIONS,
  USER_WITH_PASSWORD_SELECT_OPTIONS,
} from '@/modules/prisma/repositories/select-options/user.select-options';
import { UserEntity, UserWithPasswordEntity } from '@/modules/user/user.entity';
import { UserInterface } from '@/modules/user/user.interface';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(newUser: UserInterface): Promise<UserEntity> {
    return this.prisma.user.create({
      select: USER_SELECT_OPTIONS,
      data: newUser,
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
