import { Injectable } from '@nestjs/common';
import { IFindManyTags, IFindManyTagsFullResp, ITag, ITagWithId } from '@/modules/tag/tag.interface';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { ACCESS_VIOLATION_ERR_MSG, UNIQUE_VIOLATION_ERR_MSG } from '@/constants/messages.constants';
import { TagEntity } from '@/modules/tag/tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepo) {}

  async create(args: ITag): Promise<number> {
    const existingTagId = await this.tagRepo.getIdByValue(args.fsValue, args.bsValue);
    if (existingTagId) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, UNIQUE_VIOLATION_ERR_MSG);
    }

    return this.tagRepo.create(args);
  }

  async findMany(args: IFindManyTags): Promise<IFindManyTagsFullResp> {
    const [{ page, pageSize, tags }, totalRecords] = await Promise.all([
      this.tagRepo.findMany(args),
      this.tagRepo.getTotalCount(args),
    ]);

    return { page, pageSize, records: tags.length, totalRecords, tags };
  }

  async findOneById(tagId: number): Promise<TagEntity> {
    return this.tagRepo.findOneById(tagId);
  }

  async updateOneById(args: ITagWithId): Promise<number> {
    const { tagId, authorId, ...data } = args;
    await this.checkEditingRights(tagId, authorId);

    return this.tagRepo.updateOneById(tagId, data);
  }

  async delete(tagId: number, userId: string): Promise<number> {
    await this.checkEditingRights(tagId, userId);

    return this.tagRepo.delete(tagId);
  }

  async checkEditingRights(tagId: number, userId: string): Promise<void> {
    const tag = await this.tagRepo.findOneById(tagId);
    if (tag.authorId !== userId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, ACCESS_VIOLATION_ERR_MSG);
    }
  }
}
