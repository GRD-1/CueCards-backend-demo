import { Injectable } from '@nestjs/common';

@Injectable()
export class ExerciseService {
  async findAll(): Promise<string> {
    return 'full list of available exercises';
  }

  async findOne(dictionaryId: number): Promise<string> {
    return 'the specific exercise';
  }
}
