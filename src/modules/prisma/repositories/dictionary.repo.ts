import { Injectable } from '@nestjs/common';
import { Dictionary } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  DictionaryInterface,
  FindManyArgsInterface,
  FindManyRespInterface,
} from '@/modules/dictionary/dictionary.interface';

@Injectable()
export class DictionaryRepo {
  constructor(private readonly db: PrismaService) {}

  async create(payload: DictionaryInterface, authorId: number): Promise<number> {
    const newDictionary = await this.db.dictionary.create({
      data: {
        ...payload,
        authorId,
      },
    });

    return newDictionary.id;
  }

  async findMany(args: FindManyArgsInterface): Promise<FindManyRespInterface> {
    const { page = 1, pageSize = 20, authorId, title } = args;

    const dictionaries = await this.db.dictionary.findMany({
      where: { authorId, title },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { page, pageSize, dictionaries };
  }

  async getCount(authorId?: number): Promise<number> {
    return this.db.dictionary.count({ where: { authorId } });
  }

  async findOneById(id: number): Promise<Dictionary | null> {
    return this.db.dictionary.findUnique({
      where: { id },
    });
  }

  async findOneByTitle(title: string): Promise<Dictionary | null> {
    return this.db.dictionary.findFirst({
      where: { title },
    });
  }

  async updateOneById(dictionaryId: number, payload: Partial<DictionaryInterface>): Promise<number> {
    const updatedDictionary = await this.db.dictionary.update({
      where: { id: dictionaryId },
      data: payload,
    });

    return updatedDictionary.id;
  }

  async delete(dictionaryId: number): Promise<number> {
    const deletedDictionary = await this.db.dictionary.delete({
      where: { id: dictionaryId },
    });

    return deletedDictionary.id;
  }
}
