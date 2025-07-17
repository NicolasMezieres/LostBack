import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class signupDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'PROUT.' })
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'TRUOP' })
  @MinLength(1)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'PET' })
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(320)
  @MinLength(3)
  email: string;

  //@IsStrongPassword = rajoute les options pour les mdps (min caractère, caractères spéciaux)
  @IsStrongPassword({ minLength: 16 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
