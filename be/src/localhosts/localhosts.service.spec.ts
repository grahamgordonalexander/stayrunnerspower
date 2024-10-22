import { Test, TestingModule } from '@nestjs/testing';
import { LocalhostsService } from './localhosts.service';

describe('LocalhostsService', () => {
  let service: LocalhostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalhostsService],
    }).compile();

    service = module.get<LocalhostsService>(LocalhostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
