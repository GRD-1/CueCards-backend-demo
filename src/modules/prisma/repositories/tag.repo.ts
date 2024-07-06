import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { FindManyTagsInterface, FindManyTagsRespInterface, TagInterface } from '@/modules/tag/tag.interface';
import { TagEntity } from '@/modules/tag/tag.entity';

const TAG_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  name: true,
};

@Injectable()
export class TagRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, authorId: number): Promise<number> {
    const newTag = await this.prisma.tag.create({
      data: {
        name,
        authorId,
      },
    });

    return newTag.id;
  }

  async findMany(args: FindManyTagsInterface): Promise<FindManyTagsRespInterface> {
    const { page = 1, pageSize = 20, authorId, name } = args;

    const tags = await this.prisma.tag.findMany({
      select: TAG_SELECT_OPTIONS,
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
    return this.prisma.tag.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<TagEntity> {
    return this.prisma.tag.findUniqueOrThrow({
      select: TAG_SELECT_OPTIONS,
      where: { id },
    });
  }

  async getIdByName(name: string): Promise<number | null> {
    const tag = await this.prisma.tag.findFirst({
      select: { id: true },
      where: { name },
    });

    return tag?.id || null;
  }

  async updateOneById(id: number, payload: TagInterface): Promise<number> {
    const { name } = payload;
    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data: { name },
    });

    return updatedTag.id;
  }

  async delete(id: number): Promise<number> {
    const deletedTag = await this.prisma.tag.delete({
      where: { id },
    });

    return deletedTag.id;
  }
}
