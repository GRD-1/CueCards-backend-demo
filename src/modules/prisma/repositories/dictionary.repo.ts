import { Inject, Injectable } from '@nestjs/common';
import { Dictionary } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  DictionaryAndTagsInterface,
  DictionaryTagInterface,
  FindManyDictConditionsInterface,
  GetDictListInterface,
  GetDictListRespInterface,
  SearchConditionsArgsType,
  UpdateDictionaryInterface,
} from '@/modules/dictionary/dictionary.interface';
import {
  DictionaryWithTagsAndCardsEntity,
  DicWithTagsAndCardSettingsEntity,
} from '@/modules/dictionary/dictionary.entity';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { DICTIONARY_SELECT_OPTIONS } from '@/modules/prisma/repositories/select-options/dictionary.select-options';
import { userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class DictionaryRepo {
  constructor(
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    private readonly prisma: PrismaService,
  ) {}

  async create(payload: DictionaryAndTagsInterface, authorId: string): Promise<number> {
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

  async getList(args: GetDictListInterface): Promise<GetDictListRespInterface> {
    const { page = 1, pageSize = 20 } = args;
    const searchConditions: FindManyDictConditionsInterface = this.getDictSearchConditions(args);

    const dictionaries = await this.prisma.dictionary.findMany({
      select: DICTIONARY_SELECT_OPTIONS,
      where: searchConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, dictionaries };
  }

  async getTotalCount(args: SearchConditionsArgsType): Promise<number> {
    const searchConditions: FindManyDictConditionsInterface = this.getDictSearchConditions(args);

    return this.prisma.dictionary.count({ where: searchConditions });
  }

  getDictSearchConditions(args: SearchConditionsArgsType): FindManyDictConditionsInterface {
    const { userId, byUser, name, partOfName } = args;
    const searchConditions: FindManyDictConditionsInterface = {};

    searchConditions.authorId = byUser ? userId : { in: [userId, this.userConf.defaultUserId] };

    if (partOfName) {
      searchConditions.name = { contains: partOfName };
    } else if (name) {
      searchConditions.name = name;
    }

    return searchConditions;
  }

  async findOneById(id: number): Promise<DictionaryWithTagsAndCardsEntity> {
    const data: DictionaryWithTagsAndCardsEntity[] = await this.prisma.$queryRaw`
      SELECT
            d.id,
            d."authorId",
            d.name,
            COALESCE(
              json_agg(DISTINCT row_to_json(c)::jsonb)
              FILTER (WHERE c.id IS NOT NULL), '[]'
            ) AS cards,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object('id', t.id, 'authorId', t."authorId", 'name', t.name))
              FILTER (WHERE t.id IS NOT NULL), '[]'
            ) AS tags
          FROM dictionaries d
          LEFT JOIN dictionary_tags dt ON dt."dictionaryId" = d.id
          LEFT JOIN card_tags ct ON ct."tagId" = dt."tagId"
          LEFT JOIN cards c ON c.id = ct."cardId"
          LEFT JOIN tags t ON t.id = dt."tagId"
          WHERE d.id = ${id}
          GROUP BY d.id, d."authorId", d.name;
    `;

    if (!data[0]) {
      throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The dictionary was not found!');
    }

    return data[0];
  }

  async getCustomizedDictionary(id: number, userId: string): Promise<DictionaryWithTagsAndCardsEntity> {
    const data: DictionaryWithTagsAndCardsEntity[] = await this.prisma.$queryRaw`
        SELECT
            d.id,
            d."authorId",
            d.name,
            COALESCE(
              json_agg(DISTINCT row_to_json(c)::jsonb)
              FILTER (WHERE c.id IS NOT NULL), '[]'
            ) AS cards,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object('id', t.id, 'authorId', t."authorId", 'name', t.name))
              FILTER (WHERE t.id IS NOT NULL), '[]'
            ) AS tags
          FROM dictionaries d
          LEFT JOIN dictionary_tags dt ON dt."dictionaryId" = d.id
          LEFT JOIN card_tags ct ON ct."tagId" = dt."tagId"
          LEFT JOIN cards c ON c.id = ct."cardId"
          LEFT JOIN card_is_hidden ch ON ch."cardId" = c.id AND ch."userId" = ${userId}
          LEFT JOIN tags t ON t.id = dt."tagId"
          WHERE d.id = ${id} AND ch."cardId" IS NULL
          GROUP BY d.id, d."authorId", d.name;
    `;

    if (!data[0]) {
      throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The dictionary was not found!');
    }

    return data[0];
  }

  async getDictionaryWithSettings(id: number, userId: string): Promise<DicWithTagsAndCardSettingsEntity> {
    const data: DicWithTagsAndCardSettingsEntity[] = await this.prisma.$queryRaw`
        SELECT
            d.id,
            d."authorId",
            d.name,
            COALESCE(
                json_agg(DISTINCT jsonb_build_object(
                    'id', c.id,
                    'authorId', t."authorId",
                    'fsValue', c."fsValue",
                    'bsValue', c."bsValue",
                    'statistics', cs,
                    'cardIsHidden', ch."cardId" IS NOT NULL
                ))
                FILTER (WHERE c.id IS NOT NULL), '[]'
            ) AS cards,
            COALESCE(
                json_agg(DISTINCT jsonb_build_object('id', t.id, 'authorId', t."authorId", 'name', t.name))
                FILTER (WHERE t.id IS NOT NULL), '[]'
            ) AS tags
        FROM dictionaries d
        LEFT JOIN dictionary_tags dt ON dt."dictionaryId" = d.id
        LEFT JOIN card_tags ct ON ct."tagId" = dt."tagId"
        LEFT JOIN cards c ON c.id = ct."cardId"
        LEFT JOIN tags t ON t.id = dt."tagId"
        LEFT JOIN card_statistics cs ON cs."cardId" = c.id AND cs."userId" = ${userId}
        LEFT JOIN card_is_hidden ch ON ch."cardId" = c.id AND ch."userId" = ${userId}
        WHERE d.id = ${id}
        GROUP BY d.id, d."authorId", d.name;
    `;

    if (!data[0]) {
      throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The dictionary was not found!');
    }

    return data[0];
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

    if (tagIdToDeleteArr || newTagsArr) {
      await this.prisma
        .$transaction(async (prisma) => {
          await prisma.dictionary.update({
            where: { id: dictionaryId },
            data: {
              ...dictionaryData,
            },
          });

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
        })
        .catch((err) => {
          switch (err.code) {
            case 'P2025':
              throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The dictionary was not found!', err);
            case 'P2002':
              throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'This dictionary name already exists', err);
            case 'P2003':
              throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, 'The tag was not found!', err);
            default:
              throw err;
          }
        });
    } else {
      await this.prisma.dictionary.update({
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
