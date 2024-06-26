import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DictionaryInterface,
  FindManyArgsInterface,
  FindManyFullRespInterface,
} from '@/modules/dictionary/dictionary.interface';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepo: DictionaryRepo) {}

  async create(payload: DictionaryInterface, userId: number): Promise<number> {
    const dictionary = await this.dictionaryRepo.findOneByTitle(payload.title);
    if (dictionary) {
      throw new HttpException('A dictionary with that title already exists', HttpStatus.BAD_REQUEST);
    }

    return this.dictionaryRepo.create(payload, userId);
  }

  async findMany(args: FindManyArgsInterface): Promise<FindManyFullRespInterface> {
    const [{ page, pageSize, dictionaries }, totalRecords] = await Promise.all([
      this.dictionaryRepo.findMany(args),
      this.dictionaryRepo.getCount(args.authorId),
    ]);

    return { page, pageSize, totalRecords, dictionaries };
  }

  async findOneById(dictionaryId: number): Promise<DictionaryEntity | null> {
    return this.dictionaryRepo.findOneById(dictionaryId);
  }

  async updateOneById(dictionaryId: number, payload: Partial<DictionaryInterface>): Promise<number> {
    return this.dictionaryRepo.updateOneById(dictionaryId, payload);
  }

  async delete(dictionaryId: number): Promise<number> {
    return this.dictionaryRepo.delete(dictionaryId);
  }
}
