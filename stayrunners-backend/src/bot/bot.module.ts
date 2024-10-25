import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { OrderSchema } from '../models/order.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema }
    ])
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService]
})
export class BotModule {}
