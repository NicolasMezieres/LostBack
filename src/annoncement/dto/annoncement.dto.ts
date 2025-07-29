import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class annoncementDTO {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isLost: boolean;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNotEmpty()
  @IsBoolean()
  isArchive: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  picture: string;

  @IsDateString()
  @IsNotEmpty()
  dateLostOrFound: Date;
  
  @IsString()
  @IsNotEmpty()
  id: string
}
