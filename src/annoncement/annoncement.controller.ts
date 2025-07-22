import { Controller } from '@nestjs/common';
import { AnnoncementService } from './annoncement.service';

@Controller('annoncement')
export class AnnoncementController {
  constructor(private readonly annoncementService: AnnoncementService) {}
}
