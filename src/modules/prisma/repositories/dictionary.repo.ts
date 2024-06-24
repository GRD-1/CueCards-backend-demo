import { Injectable } from '@nestjs/common';
import { Dictionary } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { DictionaryInterface } from '@/modules/dictionary/dictionary.interface';

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

  async findMany(page: number, pageSize: number): Promise<Dictionary[]> {
    return this.db.dictionary.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOneById(id: number): Promise<Dictionary> {
    return this.db.dictionary.findUniqueOrThrow({
      where: { id },
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
