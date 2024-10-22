import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { City } from "./City.schema";
import mongoose from "mongoose";
import { Localhost } from "./Localhost.schema";

@Schema()
export class Room {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Localhost' })
    localhost: Localhost;

    @Prop({ required: true })
    pic_urls: string[];

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: true })
    available: boolean;

    @Prop({ required: true })
    payment_option: string;

    @Prop({ required: true })
    min_price_per_night: number;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
    // city: City;

    @Prop({ required: true })
    room_Amentities: string;
 

    @Prop({ required: true})
    RoomGoogleMapAddress: string;

    @Prop({ required: true, default: false })
    deleted: boolean;

    @Prop()
    deleted_at: Date;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);