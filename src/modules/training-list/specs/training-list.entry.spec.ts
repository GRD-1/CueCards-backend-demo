import { TrainingListEntity } from '../entities/training-list.entity';

describe('TrainingListEntry', () => {
  it('should be defined', () => {
    expect(new TrainingListEntity([])).toBeDefined();
  });
});
