import { PrismaModule } from '@/modules/prisma/prisma.module';
import { CardRepo } from '@/repos/card.repo';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [
    CardRepo,
  ],
  exports: [
    CardRepo,
  ],
})
export class RepositoriesModule {}
