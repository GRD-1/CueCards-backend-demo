import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { LanguageEntity } from '@/modules/language/language.entity';
import {
  FindManyLangConditionsInterface,
  FindManyLanguagesInterface,
  FindManyLanguagesRespInterface,
  LanguageInterface,
  SearchConditionsArgsType,
} from '@/modules/language/language.interface';
import { LANGUAGE_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/language.select-options';

@Injectable()
export class LanguageRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, acronym: string): Promise<number> {
    const newLanguage = await this.prisma.language.create({
      data: {
        name,
        acronym,
      },
    });

    return newLanguage.id;
  }

  async findMany(args: FindManyLanguagesInterface): Promise<FindManyLanguagesRespInterface> {
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: FindManyLangConditionsInterface = this.getLanguageSearchConditions(args);

    const languages = await this.prisma.language.findMany({
      select: LANGUAGE_SELECT_OPTIONS,
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, languages };
  }

  async getTotalCount(args: SearchConditionsArgsType): Promise<number> {
    const searchConditions: FindManyLangConditionsInterface = this.getLanguageSearchConditions(args);

    return this.prisma.language.count({ where: searchConditions });
  }

  getLanguageSearchConditions(args: SearchConditionsArgsType): FindManyLangConditionsInterface {
    const { name, partOfName } = args;
    const searchConditions: FindManyLangConditionsInterface = {};

    if (partOfName) {
      searchConditions.name = { contains: partOfName };
    } else if (name) {
      searchConditions.name = name;
    }

    return searchConditions;
  }

  async findOneById(id: number): Promise<LanguageEntity> {
    return this.prisma.language.findUniqueOrThrow({
      select: LANGUAGE_SELECT_OPTIONS,
      where: { id },
    });
  }

  async getIdByNameOrAcronym(name: string, acronym: string): Promise<number | null> {
    const language = await this.prisma.language.findFirst({
      select: { id: true },
      where: {
        OR: [{ name }, { acronym }],
      },
    });

    return language?.id || null;
  }

  async updateOneById(id: number, payload: LanguageInterface): Promise<number> {
    const updatedLanguage = await this.prisma.language.update({
      where: { id },
      data: { ...payload },
    });

    return updatedLanguage.id;
  }

  async delete(id: number): Promise<number> {
    const deletedLanguage = await this.prisma.language.delete({
      where: { id },
    });

    return deletedLanguage.id;
  }
}
