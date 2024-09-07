import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  FindManyTagsConditionsInterface,
  FindManyTagsInterface,
  FindManyTagsRespInterface,
  SearchConditionsArgsType,
  TagInterface,
} from '@/modules/tag/tag.interface';
import { TagEntity } from '@/modules/tag/tag.entity';
import { TAG_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/tag.select-options';
import { userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TagRepo {
  constructor(
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    private readonly prisma: PrismaService,
  ) {}

  async create(name: string, authorId: string): Promise<number> {
    const newTag = await this.prisma.tag.create({
      data: {
        name,
        authorId,
      },
    });

    return newTag.id;
  }

  async findMany(args: FindManyTagsInterface): Promise<FindManyTagsRespInterface> {
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: FindManyTagsConditionsInterface = this.getTagSearchConditions(args);

    const tags = await this.prisma.tag.findMany({
      select: TAG_SELECT_OPTIONS,
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, tags };
  }

  async getTotalCount(args: SearchConditionsArgsType): Promise<number> {
    const searchConditions: FindManyTagsConditionsInterface = this.getTagSearchConditions(args);

    return this.prisma.tag.count({ where: searchConditions });
  }

  getTagSearchConditions(args: SearchConditionsArgsType): FindManyTagsConditionsInterface {
    const { authorId, byUser, name, partOfName } = args;
    const searchConditions: FindManyTagsConditionsInterface = {};

    searchConditions.authorId = byUser ? authorId : { in: [authorId, this.userConf.defaultUserId] };

    if (partOfName) {
      searchConditions.name = { contains: partOfName };
    } else if (name) {
      searchConditions.name = name;
    }

    return searchConditions;
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
