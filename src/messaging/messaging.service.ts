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
  async messaging(dto: messagingDTO) {
    const existingMessaging =await this.prisma.messaging.findUnique({
      where: {}
    })

  }
}
