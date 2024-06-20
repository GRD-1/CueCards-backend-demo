import { Test, TestingModule } from '@nestjs/testing';
import { TrainingListController } from '../training-list.controller';

describe('TrainingListController', () => {
  let controller: TrainingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingListController],
    }).compile();

    controller = module.get<TrainingListController>(TrainingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
