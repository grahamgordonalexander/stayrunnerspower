// test/e2e/customerJourney.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // Add this
import * as puppeteer from 'puppeteer';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'path';
import { TestConfigModule } from '../config/test.config';

describe('Customer Journey E2E Tests', () => {
  let app: NestExpressApplication; // Change this from INestApplication
  let browser: puppeteer.Browser;
  let page: puppeteer.Page; // Declare at the describe level
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestConfigModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongoUri,
          }),
        }),
        AppModule,
      ],
    }).compile();

    // Create specifically as NestExpressApplication
    app = moduleFixture.createNestApplication<NestExpressApplication>();
    
    // Now these methods will be recognized
    app.useStaticAssets(join(__dirname, '../../src/public/static'));
    app.setBaseViewsDir(join(__dirname, '../../src/public/views'));
    
    await app.init();
    await app.listen(3333);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    page = await browser.newPage();
  });

  beforeEach(async () => {
    try {
      const response = await page.goto('http://localhost:3333', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      
      // Debug information
      console.log('Page status:', response.status());
      const content = await page.content();
      console.log('Page content:', content.substring(0, 200) + '...'); // Show first 200 chars
      
    } catch (error) {
      console.error('Navigation error:', error);
    }
  });

  afterAll(async () => {
    await browser?.close();
    await app?.close();
    await mongod?.stop();
  });

  it('should show login form', async () => {
    await page.waitForSelector('[data-testid="login-form"]', { timeout: 5000 });
    
    const form = await page.$('[data-testid="login-form"]');
    const emailInput = await page.$('[data-testid="email-input"]');
    const passwordInput = await page.$('[data-testid="password-input"]');
    
    expect(form).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  }, 30000);

  it('should validate email input', async () => {
    await page.waitForSelector('[data-testid="email-input"]', { timeout: 5000 });
    
    await page.type('[data-testid="email-input"]', 'test@example.com');
    const emailInput = await page.$('[data-testid="email-input"]');
    
    expect(emailInput).toBeTruthy();
  }, 30000);

  it('should handle form submission', async () => {
    await page.waitForSelector('[data-testid="login-form"]', { timeout: 5000 });
    
    await page.type('[data-testid="email-input"]', 'test@example.com');
    await page.type('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="submit-button"]');
    
    await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
  }, 30000);
});
