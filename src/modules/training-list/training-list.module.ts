import { Module } from '@nestjs/common';
import { TrainingListController } from './training-list.controller';
import { TrainingListService } from './training-list.service';

@Module({
  controllers: [TrainingListController],
  providers: [TrainingListService]
})
export class TrainingListModule {}
