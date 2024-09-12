import { Injectable } from '@nestjs/common';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { LanguageRepo } from '@/modules/prisma/repositories/language.repo';
import {
  FindManyLangFullRespInterface,
  FindManyLanguagesInterface,
  LanguageInterface,
} from '@/modules/language/language.interface';
import { LanguageEntity } from '@/modules/language/language.entity';
import { UNIQUE_VIOLATION_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  async create(name: string, acronym: string): Promise<number> {
    const existingLanguageId = await this.languageRepo.getIdByNameOrAcronym(name, acronym);
    if (existingLanguageId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, UNIQUE_VIOLATION_ERR_MSG);
    }

    return this.languageRepo.create(name, acronym);
  }

  async findMany(args: FindManyLanguagesInterface): Promise<FindManyLangFullRespInterface> {
    const [{ page, pageSize, languages }, totalRecords] = await Promise.all([
      this.languageRepo.findMany(args),
      this.languageRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: languages.length, totalRecords, languages };
  }

  async findOneById(languageId: number): Promise<LanguageEntity> {
    return this.languageRepo.findOneById(languageId);
  }

  async updateOneById(languageId: number, payload: LanguageInterface): Promise<number> {
    return this.languageRepo.updateOneById(languageId, payload);
  }

  async delete(languageId: number): Promise<number> {
    return this.languageRepo.delete(languageId);
  }
}
