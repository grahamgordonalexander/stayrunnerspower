//stayrunnerspower/stayrunners-backend/ test/integration/orderFlow.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { setupTestEnvironment } from '../setup';
import { AppModule } from '../../src/app.module';
import { TestConfigModule } from '../config/test.config';
import { TestEnvironment } from '../setup';
import { INestApplication } from '@nestjs/common';

describe('Order Flow Integration Tests', () => {
  let testEnv: TestEnvironment;
  let app: INestApplication;

  beforeAll(async () => {
    jest.setTimeout(60000); // Set timeout to 60 seconds
    
    testEnv = await setupTestEnvironment();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestConfigModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (testEnv?.cleanup) await testEnv.cleanup();
    if (app) await app.close();
  });

  it('should complete order negotiation flow', async () => {
    // Sample test case
    const mockOrder = {
      product: 'Test Product',
      price: 100,
      eta: '30min'
    };

    // Add your test logic here
    expect(mockOrder).toBeDefined();
  });
});
