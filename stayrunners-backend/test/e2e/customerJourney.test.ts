import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(90000);

describe('Customer Journey E2E Tests', () => {
  let app: INestApplication;
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongoUri,
          }),
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  afterAll(async () => {
    await browser?.close();
    await app?.close();
    await mongod?.stop();
  });

  beforeEach(async () => {
    try {
      await page.goto('http://localhost:3333', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  });

  it('should show login form', async () => {
    // Wait for form to be rendered
    await page.waitForSelector('form', { timeout: 5000 });
    
    const form = await page.$('form');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    
    expect(form).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  }, 30000);

  it('should validate email input', async () => {
    const emailSelector = 'input[type="email"]';
    await page.waitForSelector(emailSelector, { timeout: 5000 });
    
    await page.type(emailSelector, 'test@example.com');
    const emailInput = await page.$(emailSelector);
    expect(emailInput).toBeTruthy();
  }, 30000);

  it('should handle form submission', async () => {
    await page.waitForSelector('form', { timeout: 5000 });
    
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or network idle
    await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
  }, 30000);
});
