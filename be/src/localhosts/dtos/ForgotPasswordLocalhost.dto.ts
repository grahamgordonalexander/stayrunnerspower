import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordLocalhostDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;
}
