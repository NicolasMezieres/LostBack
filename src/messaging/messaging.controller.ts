import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { annoncementDTO } from 'src/annoncement/dto';
import { messagingDTO } from './dto/messaging.dto';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('getAnnoncementId')
  getAnnoncementId(@Body() dto: annoncementDTO) {
    return this.messagingService.getAnnoncementId(dto);
  }
}
