import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDTO } from './dto';
import { Role } from 'src/utils/enum';
import { queryUser } from 'src/utils/type';
import { isEndList } from 'src/utils/const';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(user: User) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
  }

  async patchMyProfile(user: User, dto: profileDTO) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingEmail) {
      throw new ForbiddenException('Email already taken');
    } else if (existingUsername) {
      throw new ForbiddenException('Username already taken');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { ...dto },
    });
    return { message: 'Profile update successfully' };
  }
  async disableAccount(user: User) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });
    return { message: 'Your account is disable now!' };
  }
  async getAllUser(query: queryUser) {
    const take = 10;
    const skip =
      Number(query.page) - 1 <= 0 || isNaN(Number(query.page))
        ? 0
        : (Number(query.page) - 1) * take;
    const countUser = await this.prisma.user.count({
      where: {
        role: { name: Role.USER },
        OR: [
          { username: { contains: query.search } },
          { email: { contains: query.search } },
        ],
      },
    });

    return {
      data: await this.prisma.user.findMany({
        where: {
          role: { name: Role.USER },
          OR: [
            { username: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        },
        omit: {
          roleId: true,
          activationToken: true,
          password: true,
        },
        take: 10,
        skip: skip,
      }),
      totalUser: countUser,
      isEndList: isEndList(skip, take, countUser),
    };
  }
  async getStatistic() {
    const numberAccount = await this.prisma.user.count();
    const numberActiveAccount = await this.prisma.user.count({
      where: { isActive: true },
    });
    const numberAnnouncement = await this.prisma.announcement.count();
    const numberArchiveAnnouncement = await this.prisma.announcement.count({
      where: { isArchive: true },
    });
    return {
      numberAccount,
      numberActiveAccount,
      numberAnnouncement,
      numberArchiveAnnouncement,
    };
  }

  async banUser(id: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: id, role: { name: Role.USER }, isActive: true },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: { id: id },
      data: { isActive: false },
    });
    return { message: existingUser.username + ' is ban' };
  }
  async removeUser(id: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: id, role: { name: Role.USER } },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({
      where: { id: id },
    });
    return { message: existingUser.username + ' is remove' };
  }
}
