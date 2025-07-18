import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class ResetPasswordDTO {
  @IsStrongPassword({ minLength: 16 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
