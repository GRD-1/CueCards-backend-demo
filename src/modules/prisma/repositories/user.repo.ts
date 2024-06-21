import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class UserRepo {
  constructor(private readonly db: PrismaService) {}

  async create(newUser: User): Promise<User> {
    return this.db.user.create({ data: newUser });
  }

  async findOne(email?: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        id,
      },
    });
  }
}
