import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

interface Currency {
    code: string;
    name: string;
    symbol: string;
}
interface Language {
    code: string;
    name: string;
}

@Schema()
export class Country {

    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    code: string;
  
    @Prop({ required: true })
    capital: string;
  
    @Prop({ required: true })
    region: string;
  
    @Prop({ required: true, type: Object })
    currency: Currency;
  
    @Prop({ required: true, type: Object})
    language: Language;
  
    @Prop({ required: true })
    flag: string;
  }

export const CountrySchema = SchemaFactory.createForClass(Country);