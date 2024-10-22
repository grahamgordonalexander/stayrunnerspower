import { Module } from '@nestjs/common';
//import { ChatResponseService } from './chatResponse.service';
import { WebhookController } from './chatResponse.controller';
import { ChatResponseService } from './chatResponse.service';


@Module({
  imports: [],
  // controllers: [ChatResponseController],
  controllers: [WebhookController],

  providers: [ChatResponseService],

})
export class chatResponseModule {}
