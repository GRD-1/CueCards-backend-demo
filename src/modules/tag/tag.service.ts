import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindManyTagsFullRespInterface, FindManyTagsInterface } from '@/modules/tag/tag.interface';
import { TagEntity } from '@/modules/tag/tag.entity';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepo) {}

  async create(name: string, userId: number): Promise<number> {
    const tag = await this.tagRepo.findOneByName(name);
    if (tag) {
      throw new HttpException('A tag with that value already exists', HttpStatus.BAD_REQUEST);
    }

    return this.tagRepo.create(name, userId);
  }

  async findMany(args: FindManyTagsInterface): Promise<FindManyTagsFullRespInterface> {
    const [{ page, pageSize, tags }, totalRecords] = await Promise.all([
      this.tagRepo.findMany(args),
      this.tagRepo.getCount(args.authorId),
    ]);

    return { page, pageSize, totalRecords, tags };
  }

  async findOneById(tagId: number): Promise<TagEntity | null> {
    return this.tagRepo.findOneById(tagId);
  }

  async updateOneById(tagId: number, name: string): Promise<number> {
    return this.tagRepo.updateOneById(tagId, name);
  }

  async delete(tagId: number): Promise<number> {
    return this.tagRepo.delete(tagId);
  }
}
