import { Module } from '@nestjs/common';
import { CardRepo } from '@/modules/prisma/repositories/card.repo';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { TagRepo } from '@/modules/prisma/repositories/tag.repo';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService, CardRepo],
})
export class CardModule {}
