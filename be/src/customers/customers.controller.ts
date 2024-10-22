import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateBidDto } from './dtos/CreateBid.dto';
import { Response } from 'express';
import mongoose from 'mongoose';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post('/create-bid')
  async createBid(@Body() createBidDto: CreateBidDto, @Res() res: Response) {
    console.log('Received bid:', createBidDto);
    const isValidCity = mongoose.Types.ObjectId.isValid(createBidDto.city);
    if (!isValidCity) throw new HttpException('City does not exist', 400);
    
    const customer = await this.customersService.createBid(createBidDto);
    if (customer === 'City does not exist') {
      throw new HttpException('City does not exist', 400);
    } else if (customer === null) {
      throw new HttpException('Invalid data', 400);
    } else if (customer) {
      return res.status(201).json({
        data: customer,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
    
  }
}
