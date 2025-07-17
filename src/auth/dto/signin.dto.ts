import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class signinDTO {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 16 })
  @MaxLength(255)
  password: string;
}
