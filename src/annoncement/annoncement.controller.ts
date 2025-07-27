import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnnoncementService } from './annoncement.service';
import { annoncementDTO } from './dto';
import { categoryDTO } from 'src/category/dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('annoncement')
export class AnnoncementController {
  constructor(private readonly annoncementService: AnnoncementService) {}

  @UseGuards(JwtGuard)
  @Post('createAnnoncement')
  annoncement(@Body() dto: annoncementDTO, @GetUser() user: User) {
    return this.annoncementService.annoncement(dto, user);
  }
  @UseGuards(AdminGuard)
  @Delete('deleteAnnoncement/:id')
  deleteAnnoncement(@Param('id') id: string) {
    return this.annoncementService.deleteAnnoncement(id);
  }

  @UseGuards(JwtGuard)
  @Patch('archiveAnnoncement/:id')
  archiveAnnoncement(@Param('id') id: string) {
    return this.annoncementService.archiveAnnoncement(id);
  }

 
  @Get('getCategoryInAnnoncement')
  getCategoryInAnnoncement(@Body() dto: categoryDTO) {
    return this.annoncementService.getCategoryInAnnoncement(dto);
  }
}
