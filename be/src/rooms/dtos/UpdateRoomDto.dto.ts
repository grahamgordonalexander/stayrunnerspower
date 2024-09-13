import { IsNotEmpty, IsString } from "class-validator";
import { City } from "src/schemas/City.schema";

export class UpdateRoomDto {
    room_id: string;

    localhost: string;

    pic_urls: string[];

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    payment_option: string;

    @IsNotEmpty()
    min_price_per_night: number;

    // @IsNotEmpty()
    // @IsString()
    // city: City;

    @IsNotEmpty()
    @IsString()
    room_Amentities: string;
}