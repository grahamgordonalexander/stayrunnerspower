// src/bot/bot.controller.ts
import { BotService } from './bot.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('customer/request')
  async handleCustomerRequest(@Body() data: any) {
    return this.botService.handleCustomerRequest(data);
  }

  @Post('runner/response')
  async handleRunnerResponse(@Body() data: any) {
    return this.botService.handleRunnerResponse(data);
  }
}
