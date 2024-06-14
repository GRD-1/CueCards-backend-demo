import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoriesModule } from '@/repos/repositories.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities/card.entity';

@Module({
  imports: [RepositoriesModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
