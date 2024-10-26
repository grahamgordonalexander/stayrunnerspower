import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log('Static path:', join(__dirname, '..', 'src/public/static'));
  console.log('Views path:', join(__dirname, '..', 'src/public/views'));
  

  
  // Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'src/public/static'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/public/views'));
 
  const port - process.env.PORT || 3333;
  await app.listen(port);

  console.log('Application is running on: ${await app.getUrl()}');
}
bootstrap();
