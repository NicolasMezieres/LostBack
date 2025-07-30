import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { annoncementDTO } from 'src/annoncement/dto';
import { messagingDTO } from './dto/messaging.dto';
import { Announcement } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('getAnnoncementId')
  getAnnoncementId(@Body() dto: annoncementDTO) {
    return this.messagingService.getAnnoncementId(dto);
  }

  @UseGuards(JwtGuard)
  @Post('createMessaging')
  createMessaging(@Body() dto: messagingDTO, annoncementDTO: Announcement) {
    return this.messagingService.messaging(dto, annoncementDTO);
  }

  @Get('getMessagingByAnnouncementId')
  getMessagingByAnnouncementId(@Body('announcementId') announcementId: string) {
    return this.messagingService.getMessagingByAnnouncementId(announcementId);
  }

  @Get('getMessagingById')
  getMessagingById(@Body('id') id: string) {
    return this.messagingService.getMessagingById(id);
  }
}
