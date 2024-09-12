import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Customer } from "./Customer.schema";

@Schema()
export class Bid {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({ required: true })
  beds: number;

  @Prop({ required: true })
  people: number;

  @Prop({ required: true })
  nights: number;

  @Prop({ required: true })
  price_willing_to_pay: number;

  @Prop({ required: true })
  checkInDate: string;

  @Prop()
  special_instructions: string;

  @Prop({ enum: ['active', 'pending', 'cancelled', 'completed'], default: 'active' })
  bid_status: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);