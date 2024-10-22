import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyLocalhostDto {
  @IsNumber()
  @IsNotEmpty()
  verification_code: number;

  //Password: string;
}
