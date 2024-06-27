import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaService, TagRepo],
})
export class TagModule {}