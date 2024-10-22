import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { Bid, BidSchema } from 'src/schemas/Bid.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from 'src/schemas/Customer.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
