import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { City } from "./City.schema";

@Schema()
export class Customer {
    @Prop({ required: true })
    name: string;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
    city: City;
  
    @Prop({ required: true, unique: true }) // Assuming email is unique for each customer
    email: string;
  
    @Prop({ default: Date.now })
    created_at: Date;
  
    @Prop({ default: Date.now })
    updated_at: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);