import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateBidDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    beds: number;

    @IsNotEmpty()
    people: number;

    @IsNotEmpty()
    nights: number;

    @IsNotEmpty()
    price_willing_to_pay: number;

    @IsNotEmpty()
    @IsString()
    special_instructions: string;

    checkInDate: any
  
}