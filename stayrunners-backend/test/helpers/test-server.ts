import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

export class TestServer {
  private app: INestApplication;

  async start(port: number): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.listen(port);
    return this.app;
  }

  async stop(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }
}
