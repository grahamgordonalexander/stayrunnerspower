import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoomDto {
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

 

    @IsNotEmpty()
    @IsString()
    room_Amentities: string;

    @IsNotEmpty()
    @IsString()
    RoomGoogleMapAddress: string;


}