import { Injectable } from '@nestjs/common';
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
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

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
        .catch((err) => {
          if (!newDictionary) {
            throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, 'failed to create a dictionary!', err);
          } else {
            throw new CueCardsError(
              CCBK_ERROR_CODES.INVALID_DATA,
              "failed to link the tags. The dictionary wasn't created!",
              err,
            );
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

  async findOneById(id: number): Promise<DictionaryEntity> {
    return this.prisma.dictionary.findUniqueOrThrow({
      select: DICTIONARY_SELECT_OPTIONS,
      where: { id },
    });
  }

  async getIdByName(name: string): Promise<number | null> {
    const dictionary = await this.prisma.dictionary.findFirst({
      select: { id: true },
      where: { name },
    });

    return dictionary?.id || null;
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
        .catch((err) => {
          if (!updatedDictionary) {
            throw new CueCardsError(CCBK_ERROR_CODES.INVALID_DATA, 'failed to update a dictionary!', err);
          } else {
            throw new CueCardsError(
              CCBK_ERROR_CODES.INVALID_DATA,
              "failed to link the tags. The dictionary wasn't updated!",
              err,
            );
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
