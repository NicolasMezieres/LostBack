import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService,PrismaService],
})
export class MessagingModule {}
