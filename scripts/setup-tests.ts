#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

// Update paths to target backend directory
const ROOT_DIR = process.cwd(); // stayrunnerspower
const BACKEND_DIR = path.join(ROOT_DIR, 'stayrunners-backend');
const TEST_DIR = path.join(BACKEND_DIR, 'test');

// File content generators
const generateTestSetup = () => `
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Socket } from 'socket.io-client';
import { createTestClient } from './utils/testClient';

export const setupTestEnvironment = async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  const socket: Socket = await createTestClient();

  return {
    mongoServer,
    socket,
    cleanup: async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
      socket.disconnect();
    }
  };
};`;

const generateOrderFlowTests = () => `
import { setupTestEnvironment } from '../setup';

describe('Order Flow Integration Tests', () => {
  let testEnv;
  
  beforeAll(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('should complete full order negotiation flow', async () => {
    const mockOrder = {
      product: 'Test Product',
      price: 100,
      eta: 30
    };

    const initialBid = await testEnv.socket.emit('customer:initialBid', mockOrder);
    expect(initialBid.status).toBe('pending');

    const runnerResponse = await testEnv.socket.emit('runner:firstResponse', {
      orderId: initialBid.orderId,
      accept: true
    });
    expect(runnerResponse.status).toBe('accepted');
  });
});`;

const generateGroqBotTests = () => `
import { processCustomerMessage } from '../../src/bot/bot.service';

describe('Groq Bot Unit Tests', () => {
  it('should process customer messages correctly', async () => {
    const mockMessage = {
      type: 'initialBid',
      content: {
        product: 'Test Product',
        price: 100,
        eta: 30
      }
    };

    const botResponse = await processCustomerMessage(mockMessage);
    expect(botResponse.type).toBe('offerOptions');
    expect(botResponse.options).toHaveLength(3);
  });
});`;

const generateCustomerJourneyTests = () => `
import { Browser, Page } from 'playwright';

describe('Customer Journey E2E Tests', () => {
  let page: Page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  afterAll(async () => {
    await page.close();
  });

  it('should complete full customer journey', async () => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    await page.goto('/customer/dashboard');
    await page.click('[data-testid="new-order"]');
    await page.fill('[data-testid="product"]', 'Test Product');
    await page.fill('[data-testid="price"]', '100');
    await page.fill('[data-testid="eta"]', '30');
    await page.click('[data-testid="submit-order"]');

    const orderStatus = await page.textContent('[data-testid="order-status"]');
    expect(orderStatus).toBe('Pending Runner Acceptance');
  });
});`;

const generateMockData = () => `
export const mockCustomer = {
  id: 'test_customer',
  email: 'test@example.com',
  cardToken: 'test_card_token'
};

export const mockRunner = {
  id: 'test_runner',
  inventory: ['Test Product'],
  tokenBalance: 100
};

export const mockOrder = {
  id: 'test_order',
  product: 'Test Product',
  price: 100,
  eta: 30,
  status: 'pending'
};`;

const generateTestClient = () => `
import { io, Socket } from 'socket.io-client';

export const createTestClient = async (): Promise<Socket> => {
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket']
  });

  return new Promise((resolve) => {
    socket.connect();
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};`;

const generateJestConfig = () => `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
};`;

// Directory creation
const createDirectoryStructure = async (): Promise<void> => {
  const directories = [
    TEST_DIR,
    path.join(TEST_DIR, 'unit'),
    path.join(TEST_DIR, 'integration'),
    path.join(TEST_DIR, 'e2e'),
    path.join(TEST_DIR, 'utils'),
  ];

  for (const dir of directories) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// File creation
const createFiles = async (): Promise<void> => {
  const files = [
    { path: path.join(TEST_DIR, 'setup.ts'), content: generateTestSetup() },
    { path: path.join(TEST_DIR, 'integration/orderFlow.test.ts'), content: generateOrderFlowTests() },
    { path: path.join(TEST_DIR, 'unit/groqBot.test.ts'), content: generateGroqBotTests() },
    { path: path.join(TEST_DIR, 'e2e/customerJourney.test.ts'), content: generateCustomerJourneyTests() },
    { path: path.join(TEST_DIR, 'utils/mockData.ts'), content: generateMockData() },
    { path: path.join(TEST_DIR, 'utils/testClient.ts'), content: generateTestClient() },
    { path: path.join(BACKEND_DIR, 'jest.config.js'), content: generateJestConfig() }
  ];

  for (const file of files) {
    await fs.writeFile(file.path, file.content.trim());
    console.log(`Created file: ${file.path}`);
  }
};

// Installation function with proper typing
const installDependencies = (): Promise<void> => {
  return new Promise((resolve: (value: void) => void, reject) => {
    const install = spawn('npm', ['install'], { 
      stdio: 'inherit',
      cwd: BACKEND_DIR
    });
    
    install.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
};

// Main setup function
const setupTests = async (): Promise<void> => {
  try {
    // Check if backend directory exists
    try {
      await fs.access(BACKEND_DIR);
    } catch {
      console.error('Error: stayrunners-backend directory not found!');
      console.error('Make sure you\'re running this script from the root directory (stayrunnerspower)');
      process.exit(1);
    }

    console.log('Creating test directory structure...');
    await createDirectoryStructure();

    console.log('Creating test files...');
    await createFiles();

    console.log('Installing dependencies...');
    await installDependencies();

    console.log('Test setup completed successfully!');
  } catch (error) {
    console.error('Error setting up tests:', error);
    process.exit(1);
  }
};

// Run setup
setupTests();
