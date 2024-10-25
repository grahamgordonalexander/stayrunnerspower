import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from '../src/bot/bot.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('BotService', () => {
  let service: BotService;

  const mockOrderModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: getModelToken('Order'),
          useValue: mockOrderModel
        },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle customer request', async () => {
    const mockData = {
      customerId: 'test-customer',
      message: 'test message'
    };

    const result = await service.handleCustomerRequest(mockData);
    expect(result).toBeDefined();
    expect(result.status).toBe('processed');
  });

  it('should handle runner response', async () => {
    const mockData = {
      runnerId: 'test-runner',
      customerId: 'test-customer',
      message: 'test response'
    };

    const result = await service.handleRunnerResponse(mockData);
    expect(result).toBeDefined();
    expect(result.status).toBe('processed');
  });
});
