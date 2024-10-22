import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from 'src/schemas/Customer.schema';
import { Bid, BidSchema } from 'src/schemas/Bid.schema';
import { Localhost, LocalhostSchema } from 'src/schemas/Localhost.schema';
import { RoomRequests, RoomRequestsSchema } from 'src/schemas/RoomRequests.schema';
import { EmailService } from 'src/utils/EmailService';
import { City, CitySchema } from 'src/schemas/City.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name : Bid.name, schema: BidSchema },
      { name: Localhost.name, schema: LocalhostSchema },
      { name: RoomRequests.name, schema: RoomRequestsSchema },
      { name: City.name, schema: CitySchema},
    ])
  ],
  controllers: [CustomersController],
  providers: [CustomersService, EmailService]
})
export class CustomersModule {}
