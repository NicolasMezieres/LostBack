import { IsNotEmpty, IsString } from 'class-validator';

export class messagingDTO {
  @IsString()
  @IsNotEmpty()
  annoncementId: string;

  
}
