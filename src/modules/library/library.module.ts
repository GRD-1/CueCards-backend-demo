import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';

@Module({
  imports: [DictionariesModule, CardsModule]
})
export class LibraryModule {}
