import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { messagingDTO } from './dto';
import { Announcement } from '@prisma/client';
import { annoncementDTO } from 'src/annoncement/dto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async getAnnoncementId(dto: annoncementDTO) {
    const existingAnnoncement = await this.prisma.announcement.findUnique({
      where: { id: dto.id },
    });
    if (!existingAnnoncement) {
      throw new UnauthorizedException('Announcement not found');
    }
    return { message: 'Annoncement found' };
  }

  async messaging(dto: messagingDTO, annoncementDTO: Announcement) {
    const existingMessaging = await this.prisma.messaging.findUnique({
      where: { id: dto.id, announcementId: dto.announcementId },
    });
    if (existingMessaging) {
      throw new UnauthorizedException('Messaging not found');
    }
    const createMessaging = await this.prisma.messaging.create({
      data: {
        ...dto,
      },
    });
    return { message: 'Messaging created successfully' };
  }

  async getMessagingByAnnouncementId(announcementId: string) {
    const messaging = await this.prisma.messaging.findMany({
      where: { announcementId },
    });
    if (!messaging.length) {
      throw new UnauthorizedException('No messages found for this announcement');
    }
    return messaging;
  }
  async getMessagingById(id: string) {
    const messaging = await this.prisma.messaging.findUnique({
      where: { id },
    });
    if (!messaging) {
      throw new UnauthorizedException('Messaging not found');
    }
    return messaging;
  }
}
