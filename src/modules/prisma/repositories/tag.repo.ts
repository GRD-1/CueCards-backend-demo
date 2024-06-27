import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { FindManyTagsInterface, FindManyTagsRespInterface } from '@/modules/tag/tag.interface';

@Injectable()
export class TagRepo {
  constructor(private readonly db: PrismaService) {}

  async create(name: string, authorId: number): Promise<number> {
    const newTag = await this.db.tag.create({
      data: {
        name,
        authorId,
      },
    });

    return newTag.id;
  }

  async findMany(args: FindManyTagsInterface): Promise<FindManyTagsRespInterface> {
    const { page = 1, pageSize = 20, authorId, name } = args;

    const tags = await this.db.tag.findMany({
      where: {
        AND: {
          authorId,
          name,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, tags };
  }

  async getCount(authorId?: number): Promise<number> {
    return this.db.tag.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<Tag | null> {
    return this.db.tag.findUnique({
      where: { id },
    });
  }

  async findOneByName(name: string): Promise<Tag | null> {
    return this.db.tag.findFirst({
      where: { name },
    });
  }

  async updateOneById(id: number, name: string): Promise<number> {
    const updatedTag = await this.db.tag.update({
      where: { id },
      data: { name },
    });

    return updatedTag.id;
  }

  async delete(id: number): Promise<number> {
    const deletedTag = await this.db.tag.delete({
      where: { id },
    });

    return deletedTag.id;
  }
}
