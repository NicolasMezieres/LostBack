import { Module } from '@nestjs/common';
import { AnnoncementService } from './annoncement.service';
import { AnnoncementController } from './annoncement.controller';

@Module({
  controllers: [AnnoncementController],
  providers: [AnnoncementService],
})
export class AnnoncementModule {}
