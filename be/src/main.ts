import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt')),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions});
  dotenv.config({
    path: '.env',
  });

  app.enableCors({
    origin: '*', // Allow requests from your Next.js frontend
    //methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
 /* app.enableCors({
    origin: '*', // Allow requests from your Next.js frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });*/
  await app.listen(3120);
}
bootstrap();
