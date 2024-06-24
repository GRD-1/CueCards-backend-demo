import { Injectable } from '@nestjs/common';
import { DictionaryInterface } from '@/modules/dictionary/dictionary.interface';
import { DictionaryRepo } from '@/modules/prisma/repositories/dictionary.repo';
import { DictionaryEntity } from '@/modules/dictionary/dictionary.entity';

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepo: DictionaryRepo) {}

  async create(payload: DictionaryInterface, userId: number): Promise<number> {
    return this.dictionaryRepo.create(payload, userId);
  }

  async findMany(page: number, pageSize: number): Promise<DictionaryEntity[]> {
    return this.dictionaryRepo.findMany(page, pageSize);
  }

  async findOneById(dictionaryId: number): Promise<DictionaryEntity> {
    return this.dictionaryRepo.findOneById(dictionaryId);
  }

  async updateOneById(dictionaryId: number, payload: Partial<DictionaryInterface>): Promise<number> {
    return this.dictionaryRepo.updateOneById(dictionaryId, payload);
  }

  async delete(dictionaryId: number): Promise<number> {
    return this.dictionaryRepo.delete(dictionaryId);
  }
}
