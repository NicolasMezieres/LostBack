import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { annoncementDTO } from './dto';
import { User } from '@prisma/client';
import { categoryDTO } from 'src/category/dto';


@Injectable()
export class AnnoncementService {
  constructor(private prisma: PrismaService) {}

  async annoncement(dto: annoncementDTO, user: User) {
    // const existingannoncement = await this.prisma.announcement.findFirst({
    //   where: { userId: user.id, categoryId: dto.categoryId },
    // });
    // if (existingannoncement) {
    //   throw new UnauthorizedException('This annoncement already exists ');
    // }

    const createAnnoncement = await this.prisma.announcement.create({
      data: {
        ...dto,
        userId: user.id,
        categoryId: dto.categoryId,
      },
    });
    return { message: 'Annoncement create !' };
  }

  async deleteAnnoncement(id: string) {
    const existingAnnoncement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existingAnnoncement) {
      throw new UnauthorizedException('Announcement not found');
    }
    await this.prisma.announcement.delete({
      where: { id },
    });
    return { message: 'Announcement has been deleted' };
  }

  async archiveAnnoncement(id: string) {
    const existingAnnoncement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existingAnnoncement) {
      throw new UnauthorizedException('Announcement not found');
    }
    const userArchive = await this.prisma.user.findUnique({
      where: { id: existingAnnoncement.userId },
    });
    if (!userArchive) {
      throw new UnauthorizedException('User not found');
    }
    const updatedAnnoncement = await this.prisma.announcement.update({
      where: { id },
      data: { isArchive: true },
    });
    return { message: 'Announcement has been archived', updatedAnnoncement };
  }

  async getCategoryInAnnoncement(dto: categoryDTO) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (!existingCategory) {
      throw new UnauthorizedException('Category not found');
    }
    const announcements = await this.prisma.announcement.findMany({
      where: { categoryId: existingCategory.id },
    });

    return announcements;
  }
}
