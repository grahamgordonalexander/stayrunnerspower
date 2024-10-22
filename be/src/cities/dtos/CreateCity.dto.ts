import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  city_name: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
