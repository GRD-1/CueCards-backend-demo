import { Injectable } from '@nestjs/common';
import { FindManyTagsFullRespInterface, FindManyTagsInterface, TagInterface } from '@/modules/tag/tag.interface';
import { TagEntity } from '@/modules/tag/tag.entity';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepo) {}

  async create(name: string, userId: number): Promise<number> {
    const existingTagId = await this.tagRepo.getIdByName(name);
    if (existingTagId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, 'A tag with that name already exists');
    }

    return this.tagRepo.create(name, userId);
  }

  async findMany(args: FindManyTagsInterface): Promise<FindManyTagsFullRespInterface> {
    const [{ page, pageSize, tags }, totalRecords] = await Promise.all([
      this.tagRepo.findMany(args),
      this.tagRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: tags.length, totalRecords, tags };
  }

  async findOneById(tagId: number): Promise<TagEntity> {
    return this.tagRepo.findOneById(tagId);
  }

  async updateOneById(tagId: number, payload: TagInterface, userId: number): Promise<number> {
    await this.checkEditingRights(tagId, userId);

    return this.tagRepo.updateOneById(tagId, payload);
  }

  async delete(tagId: number, userId: number): Promise<number> {
    await this.checkEditingRights(tagId, userId);

    return this.tagRepo.delete(tagId);
  }

  async checkEditingRights(tagId: number, userId: number): Promise<void> {
    const tag = await this.tagRepo.findOneById(tagId);
    if (tag.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, 'You can only change your own records.');
    }
  }
}
