import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { City } from './City.schema';

@Schema()
export class Localhost {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true }) // Assuming email is unique for each local host
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;

  @Prop({ required: true })
  verification_code: number;

  @Prop({ required: true, default: Date.now })
  verification_code_created_at: Date;

  @Prop({ required: true, default: false })
  code_verified: boolean;

  @Prop({ required: false })
  code_verified_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const LocalhostSchema = SchemaFactory.createForClass(Localhost);
