import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Customer } from "./Customer.schema";
import { Localhost } from "./Localhost.schema";

@Schema()
export class EmailLog {
    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
    customer: Customer;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Localhost' })
    localhost: Localhost;

    @Prop({ required: true })
    email: string;

    @Prop({ default: Date.now })
    created_at: Date;

}