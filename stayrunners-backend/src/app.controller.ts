// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Get()
  serveIndex() {
    // Read and return the index.html file
    const indexPath = join(__dirname, '..', 'src/public/views/index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    return content;
  }
}
