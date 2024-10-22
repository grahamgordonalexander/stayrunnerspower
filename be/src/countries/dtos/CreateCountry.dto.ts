import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  capital: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsObject()
  @IsNotEmpty()
  currency: {
    code: string;
    name: string;
    symbol: string;
  };

  @IsObject()
  @IsNotEmpty()
  language: {
    code: string;
    name: string;
  };

  @IsString()
  @IsNotEmpty()
  flag: string;
}
