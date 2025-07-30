import { IsNotEmpty, IsString } from 'class-validator';

export class messagingDTO {
  @IsString()
  @IsNotEmpty()
  announcementId: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  
}
