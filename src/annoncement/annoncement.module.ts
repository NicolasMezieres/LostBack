import { Module } from '@nestjs/common';
import { AnnoncementService } from './annoncement.service';
import { AnnoncementController } from './annoncement.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AnnoncementController],
  providers: [AnnoncementService, PrismaService],
})
export class AnnoncementModule {}
