import { UpdateTrainingListDto } from '../dto/update-training-list.dto';

describe('TrainingListDto', () => {
  it('should be defined', () => {
    expect(new UpdateTrainingListDto()).toBeDefined();
  });
});
