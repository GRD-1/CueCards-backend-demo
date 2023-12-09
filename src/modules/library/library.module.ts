import { Module } from '@nestjs/common';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [DictionariesModule, CardsModule]
})
export class LibraryModule {}
