import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
   const a = "Hello World  !!!";
    return a;
  
  }
}
