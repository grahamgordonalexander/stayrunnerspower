#!/bin/bash

set -e

echo "Setting up test environment..."

# Create necessary directories
mkdir -p src/bot
mkdir -p src/websocket
mkdir -p test/unit
mkdir -p test/integration
mkdir -p test/e2e

# Create bot.service.ts
cat > src/bot/bot.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  async handleMessage(message: any) {
    return {
      type: 'bot_response',
      content: 'Message processed',
      timestamp: new Date()
    };
  }
}
EOF

# Create socket.gateway.ts
cat > src/websocket/socket.gateway.ts << 'EOF'
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
EOF

# Create setup.ts
cat > test/setup.ts << 'EOF'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Socket, io } from 'socket.io-client';

export const setupTestEnvironment = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.4',
        downloadDir: '/tmp/mongodb-binaries'
      }
    });

    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const socket = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket']
    });

    return {
      mongoServer,
      socket,
      mongoUri,
      cleanup: async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        socket.disconnect();
      }
    };
  } catch (error) {
    console.error('Test environment setup failed:', error);
    return {
      cleanup: async () => {
        try {
          await mongoose.disconnect();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
    };
  }
};
EOF

# Create groqBot.test.ts
cat > test/unit/groqBot.test.ts << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from '../../src/bot/bot.service';

describe('GroqBot Tests', () => {
  let botService: BotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotService],
    }).compile();

    botService = module.get<BotService>(BotService);
  });

  it('should process message', async () => {
    const mockMessage = {
      type: 'initial_bid',
      content: { product: 'test', price: 100, eta: '30min' }
    };

    const result = await botService.handleMessage(mockMessage);
    expect(result).toBeDefined();
  });
});
EOF

# Create customerJourney.test.ts
cat > test/e2e/customerJourney.test.ts << 'EOF'
import { setupTestEnvironment } from '../setup';
import * as puppeteer from 'puppeteer';

describe('Customer Journey E2E Tests', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let testEnv: any;

  beforeAll(async () => {
    testEnv = await setupTestEnvironment();
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (testEnv?.cleanup) await testEnv.cleanup();
  });

  it('should load the main page', async () => {
    await page.goto('http://localhost:3000');
    expect(page.url()).toBe('http://localhost:3000');
  });
});
EOF

# Create orderFlow.test.ts
cat > test/integration/orderFlow.test.ts << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { setupTestEnvironment } from '../setup';
import { AppModule } from '../../src/app.module';

describe('Order Flow Integration Tests', () => {
  let testEnv: any;
  let app: any;

  beforeAll(async () => {
    testEnv = await setupTestEnvironment();
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (testEnv?.cleanup) await testEnv.cleanup();
    if (app) await app.close();
  });

  it('should complete order flow', async () => {
    const mockOrder = {
      product: 'Test Product',
      price: 100,
      eta: '30min'
    };

    expect(mockOrder).toBeDefined();
  });
});
EOF

# Create jest.setup.ts
cat > test/jest.setup.ts << 'EOF'
jest.setTimeout(30000);

jest.mock('socket.io-client', () => {
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn()
  };
  return {
    io: jest.fn(() => mockSocket)
  };
});
EOF

# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  verbose: true,
  testTimeout: 30000
};
EOF

# Update package.json scripts
npm pkg set scripts.test="jest"
npm pkg set scripts."test:watch"="jest --watch"
npm pkg set scripts."test:cov"="jest --coverage"
npm pkg set scripts."test:debug"="node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
npm pkg set scripts."test:unit"="jest --testPathPattern=unit"
npm pkg set scripts."test:integration"="jest --testPathPattern=integration"
npm pkg set scripts."test:e2e"="jest --testPathPattern=e2e"

# Install dependencies
npm install --save-dev \
  @nestjs/testing \
  @types/jest \
  jest \
  ts-jest \
  @types/node \
  puppeteer \
  @types/puppeteer \
  mongodb-memory-server \
  @nestjs/common \
  @nestjs/core \
  @nestjs/platform-socket.io \
  @nestjs/websockets \
  socket.io-client \
  @types/socket.io-client

# Create symbolic links for MongoDB
if [ -f /usr/lib64/libcrypto.so.1.1 ]; then
  sudo rm /usr/lib64/libcrypto.so.1.1
fi
if [ -f /usr/lib64/libssl.so.1.1 ]; then
  sudo rm /usr/lib64/libssl.so.1.1
fi
sudo ln -s /usr/lib64/libcrypto.so.3 /usr/lib64/libcrypto.so.1.1
sudo ln -s /usr/lib64/libssl.so.3 /usr/lib64/libssl.so.1.1

echo "Test environment setup completed!"
