import { Test, TestingModule } from '@nestjs/testing';
import { TrainingListService } from '../training-list.service';

describe('TrainingListService', () => {
  let service: TrainingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingListService],
    }).compile();

    service = module.get<TrainingListService>(TrainingListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
