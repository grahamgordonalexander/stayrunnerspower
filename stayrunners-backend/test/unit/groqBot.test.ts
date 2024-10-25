import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from '../../src/bot/bot.service';
import { getModelToken } from '@nestjs/mongoose';

describe('GroqBot Tests', () => {
  let botService: BotService;

  const mockOrderModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn().mockImplementation((dto) => ({
      _id: 'mock-order-id',
      ...dto
    })),
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

    botService = module.get<BotService>(BotService);
  });

  it('should process customer message', async () => {
    const mockMessage = {
      type: 'initial_bid',
      content: { product: 'test', price: 100, eta: '30min' }
    };

    const result = await botService.processMessage(mockMessage);
    expect(result).toBeDefined();
    expect(result.status).toBe('processed');
    expect(result.data).toBe(mockMessage);
  });

  it('should handle customer request', async () => {
    const mockRequest = {
      customerId: 'test-customer',
      type: 'initial_bid',
      content: { 
        product: 'test', 
        price: 100 
      }
    };

    const result = await botService.handleCustomerRequest(mockRequest);
    expect(result).toBeDefined();
    expect(result.status).toBe('processed');
    expect(mockOrderModel.create).toHaveBeenCalled();
  });

  it('should handle runner response', async () => {
    const mockResponse = {
      runnerId: 'test-runner',
      customerId: 'test-customer',
      type: 'counter_offer',
      content: { price: 120 }
    };

    const result = await botService.handleRunnerResponse(mockResponse);
    expect(result).toBeDefined();
    expect(result.status).toBe('processed');
  });
});
