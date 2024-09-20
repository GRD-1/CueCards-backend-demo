import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  IFindManyTags,
  IFindManyTagsConditions,
  IFindManyTagsResp,
  ISearchConditionsArgs,
  ITag,
} from '@/modules/tag/tag.interface';
import { userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { TAG_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/tag.select-options';
import { TagEntity } from '@/modules/tag/tag.entity';

@Injectable()
export class TagRepo {
  constructor(
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    private readonly prisma: PrismaService,
  ) {}

  async create(args: ITag): Promise<number> {
    const newTag = await this.prisma.tag.create({
      data: args,
    });

    return newTag.id;
  }

  async findMany(args: IFindManyTags): Promise<IFindManyTagsResp> {
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: IFindManyTagsConditions = this.getTagSearchConditions(args);

    const tags = await this.prisma.tag.findMany({
      select: TAG_SELECT_OPTIONS,
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, tags };
  }

  async getTotalCount(args: ISearchConditionsArgs): Promise<number> {
    const searchConditions: IFindManyTagsConditions = this.getTagSearchConditions(args);

    return this.prisma.tag.count({ where: searchConditions });
  }

  getTagSearchConditions(args: ISearchConditionsArgs): IFindManyTagsConditions {
    const { authorId, byUser, value, partOfValue, fsLanguage, bsLanguage } = args;
    const searchConditions: IFindManyTagsConditions = { fsLanguage, bsLanguage };

    searchConditions.authorId = byUser ? authorId : { in: [authorId, this.userConf.defaultUserId] };

    if (partOfValue) {
      searchConditions.value = { contains: partOfValue };
    } else if (value) {
      searchConditions.value = value;
    }

    return searchConditions;
  }

  async findOneById(id: number): Promise<TagEntity> {
    return this.prisma.tag.findUniqueOrThrow({
      select: TAG_SELECT_OPTIONS,
      where: { id },
    });
  }

  async getIdByValue(fsValue: string, bsValue: string): Promise<number | null> {
    const card = await this.prisma.card.findFirst({
      select: { id: true },
      where: {
        OR: [{ fsValue }, { bsValue }],
      },
    });

    return card?.id || null;
  }

  async updateOneById(id: number, data: Partial<ITag>): Promise<number> {
    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data,
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
