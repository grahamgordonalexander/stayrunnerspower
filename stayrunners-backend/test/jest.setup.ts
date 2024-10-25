//stayrunnerspower/stayrunners-backend/test/jest-setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { connect, Connection, disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

let mongod: MongoMemoryServer;
let mongoConnection: Connection;

jest.setTimeout(30000);

global.beforeAll(async () => {
  try {
    // Start MongoDB Memory Server
    mongod = await MongoMemoryServer.create({
      binary: {
        version: '6.0.12',
        downloadDir: '/tmp/mongodb-binaries'
      },
      instance: {
        storageEngine: 'ephemeralForTest',
        dbName: 'test'
      }
    });

    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          switch (key) {
            case 'MONGODB_URI':
              return uri;
            case 'JWT_SECRET':
              return 'test-secret';
            default:
              return null;
          }
        }),
      })
      .compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    (global as any).app = app;
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

global.afterAll(async () => {
  if (mongoConnection) {
    await mongoConnection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
  await disconnect();
  const app = (global as any).app;
  if (app) {
    await app.close();
  }
});
