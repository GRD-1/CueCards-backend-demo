import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
