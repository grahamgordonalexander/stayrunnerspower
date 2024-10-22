import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Country } from "./Country.schema";

@Schema()
export class City {
    @Prop({ required: true })
    city_name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
    country: Country;
}

export const CitySchema = SchemaFactory.createForClass(City);