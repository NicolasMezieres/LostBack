import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { annoncementDTO } from './dto';
import { User } from '@prisma/client';
import { categoryDTO } from 'src/category/dto';
import { contains } from 'class-validator';
import { queryAnnouncementAdmin } from 'src/utils/type';
import { isEndList } from 'src/utils/const';

@Injectable()
export class AnnoncementService {
  constructor(private prisma: PrismaService) {}

  async annoncement(dto: annoncementDTO, user: User) {
    const existingannoncement = await this.prisma.announcement.findFirst({
      where: { userId: user.id, categoryId: dto.categoryId },
    });
    if (existingannoncement) {
      throw new UnauthorizedException('This annocement already exists ');
    }

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
  async announcementByAdmin(query: queryAnnouncementAdmin) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: query.search ? query.search : '' },
    });
    const existingUser = await this.prisma.user.findUnique({
      where: { username: query?.search },
    });
    const take = 10;
    const skip =
      Number(query.page) - 1 <= 0 || isNaN(Number(query.page))
        ? 0
        : (Number(query.page) - 1) * take;
    const countAnnouncement = await this.prisma.announcement.count({
      where: {
        OR: [
          { userId: existingUser?.id },
          { categoryId: existingCategory?.id },
          { name: { contains: query.search } },
        ],
        isLost:
          query.isLost === 'true'
            ? true
            : query.isLost === 'false'
              ? false
              : undefined,
        dateLostOrFound: {
          lte:
            new Date(query.toDate).toString() != 'Invalid Date'
              ? new Date(
                  new Date(query.toDate).setDate(
                    new Date(query.toDate).getDate() + 1,
                  ),
                )
              : undefined,
          gte:
            new Date(query.fromDate).toString() != 'Invalid Date'
              ? new Date(query.fromDate)
              : undefined,
        },
      },
    });

    return {
      data: await this.prisma.announcement.findMany({
        where: {
          OR: [
            { userId: existingUser?.id },
            { categoryId: existingCategory?.id },
            { name: { contains: query.search } },
          ],
          isLost:
            query.isLost === 'true'
              ? true
              : query.isLost === 'false'
                ? false
                : undefined,
          dateLostOrFound: {
            lte:
              new Date(query.toDate).toString() != 'Invalid Date'
                ? new Date(
                    new Date(query.toDate).setDate(
                      new Date(query.toDate).getDate() + 1,
                    ),
                  )
                : undefined,
            gte:
              new Date(query.fromDate).toString() != 'Invalid Date'
                ? new Date(query.fromDate)
                : undefined,
          },
        },
        select: {
          id: true,
          name: true,
          picture: true,
          dateLostOrFound: true,
          user: { select: { username: true } },
        },
        take: take,
        skip: skip,
      }),
      total: countAnnouncement,
      isEndList: isEndList(skip, take, countAnnouncement),
    };
  }
}
