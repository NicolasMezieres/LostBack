import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class forgetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(320)
  @MinLength(3)
  email: string;
}
