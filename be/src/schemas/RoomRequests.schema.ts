import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Bid } from "./Bid.schema";
import { Localhost } from "./Localhost.schema";

@Schema()
export class RoomRequests {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Bid' })
  bid: Bid;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Localhost' })
  localhost: Localhost;

  @Prop({ required: true, default: false })
  accepted: boolean;

  @Prop()
  accepted_at: Date;

  @Prop()
  dealed: boolean;

  @Prop()
  dealed_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const RoomRequestsSchema = SchemaFactory.createForClass(RoomRequests);