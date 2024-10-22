import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Customer } from "./Customer.schema";
import { Room } from "./Room.schema";

@Schema()
export class Booking {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  @Prop({ required: true })
  payment: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);