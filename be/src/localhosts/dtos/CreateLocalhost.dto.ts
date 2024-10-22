import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLocalhostDto {
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

  @Optional()
  verification_code: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
