import { Module } from '@nestjs/common';
import { DictionaryShelveModule } from './dictionary-shelve/dictionary-shelve.module';
import { FileCabinetModule } from './file-cabinet/file-cabinet.module';

@Module({
  imports: [DictionaryShelveModule, FileCabinetModule]
})
export class LibraryModule {}
