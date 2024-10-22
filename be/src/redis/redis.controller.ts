import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CreateRediDto } from './dto/create-redi.dto';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('/set')
  create(@Body() createRediDto: CreateRediDto) {
    // console.log('createRediDto', createRediDto);

    return this.redisService.create(createRediDto);
  }
  @Get('/get')
  findOne(@Query('id') id: string) {
    return this.redisService.findOne(id);
  }

  @Delete('/remove')
  remove(@Query('id') id: string) {
    return this.redisService.remove(id);
  }

  @Get('clear')
  clearAll() {
    return this.redisService.clearAll();
  }
}
