import { Test, TestingModule } from '@nestjs/testing';
import { LocalhostsController } from './localhosts.controller';

describe('LocalhostsController', () => {
  let controller: LocalhostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalhostsController],
    }).compile();

    controller = module.get<LocalhostsController>(LocalhostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
