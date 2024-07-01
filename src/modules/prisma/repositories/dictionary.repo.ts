import { BadRequestException, Injectable } from '@nestjs/common';
import { Dictionary } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  DictionaryAndTagsInterface,
  DictionaryTagInterface,
  FindManyDictInterface,
  FindManyDictRespInterface,
  UpdateDictionaryInterface,
} from '@/modules/dictionary/dictionary.interface';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

const DICTIONARY_SELECT_OPTIONS = {
  id: true,
  authorId: true,
  name: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          authorId: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class DictionaryRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: DictionaryAndTagsInterface, authorId: number): Promise<number> {
    const { tags, ...newDictionaryData } = payload;
    let newDictionary: Dictionary;

    if (tags.length > 0) {
      newDictionary = await this.prisma
        .$transaction(async (prisma) => {
          newDictionary = await prisma.dictionary.create({
            data: {
              ...newDictionaryData,
              authorId,
            },
          });

          const dictionaryTags = tags.map((id) => ({ dictionaryId: newDictionary.id, tagId: id }));

          await prisma.dictionaryTag.createManyAndReturn({
            data: dictionaryTags,
          });

          return newDictionary;
        })
        .catch(() => {
          if (!newDictionary) {
            throw new BadRequestException('failed to create a dictionary. Transaction aborted!');
          } else {
            throw new BadRequestException("failed to link the tags. The dictionary wasn't created!");
          }
        });
    } else {
      newDictionary = await this.prisma.dictionary.create({
        data: {
          ...newDictionaryData,
          authorId,
        },
      });
    }

    return newDictionary.id;
  }

  async findMany(args: FindManyDictInterface): Promise<FindManyDictRespInterface> {
    const { page = 1, pageSize = 20, authorId, name } = args;

    const dictionaries = await this.prisma.dictionary.findMany({
      select: DICTIONARY_SELECT_OPTIONS,
      where: { authorId, name },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, dictionaries };
  }

  async getCount(authorId?: number): Promise<number> {
    return this.prisma.dictionary.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<DictionaryEntity | null> {
    return this.prisma.dictionary.findUnique({
      select: DICTIONARY_SELECT_OPTIONS,
      where: { id },
    });
  }

  async findOneByName(name: string): Promise<Dictionary | null> {
    return this.prisma.dictionary.findFirst({
      where: { name },
    });
  }

  async updateOneById(args: UpdateDictionaryInterface): Promise<number> {
    const { dictionaryId, dictionaryData, tagIdToDeleteArr, newTagsArr } = args;
    let updatedDictionary: Dictionary;

    if (tagIdToDeleteArr || newTagsArr) {
      await this.prisma
        .$transaction(async (prisma) => {
          if (tagIdToDeleteArr) {
            await prisma.dictionaryTag.deleteMany({
              where: {
                dictionaryId,
                tagId: {
                  in: tagIdToDeleteArr,
                },
              },
            });
          }

          if (newTagsArr) {
            await prisma.dictionaryTag.createMany({
              data: newTagsArr,
            });
          }

          await prisma.dictionary.update({
            where: { id: dictionaryId },
            data: {
              ...dictionaryData,
            },
          });

          return updatedDictionary;
        })
        .catch(() => {
          if (!updatedDictionary) {
            throw new BadRequestException('failed to update a dictionary. Transaction aborted!');
          } else {
            throw new BadRequestException("failed to link the tags. The dictionary wasn't updated!");
          }
        });
    } else {
      updatedDictionary = await this.prisma.dictionary.update({
        where: { id: dictionaryId },
        data: {
          ...dictionaryData,
        },
      });
    }

    return dictionaryId;
  }

  async delete(dictionaryId: number): Promise<number> {
    const deletedDictionary = await this.prisma.dictionary.delete({
      where: { id: dictionaryId },
    });

    return deletedDictionary.id;
  }

  async getDictionaryTags(dictionaryId: number): Promise<DictionaryTagInterface[]> {
    return this.prisma.dictionaryTag.findMany({
      where: { dictionaryId },
    });
  }
}
