import { Module } from '@nestjs/common';
import { TrainingListModule } from './training-list/training-list.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [TrainingListModule, ExerciseModule]
})
export class TrainingModule {}
