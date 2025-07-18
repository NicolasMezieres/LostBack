import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDTO } from './dto';

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
  async getAllUser(user: User, page: string) {
    const take = 10;
    const skip =
      Number(page) - 1 <= 0 || isNaN(Number(page))
        ? 0
        : (Number(page) - 1) * take;
    return {
      data: await this.prisma.user.findMany({
        omit: { roleId: true, activationToken: true },
        take: 10,
        skip: skip,
      }),
    };
  }
}
