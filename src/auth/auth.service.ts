import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { signupDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Role } from 'src/utils/enum';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: signupDTO) {
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new UnauthorizedException('Username is already taken');
    }
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new UnauthorizedException('Email is already taken');
    }
    const existingUserRole = await this.prisma.role.findUnique({
      where: { name: Role.USER },
    });
    if (!existingUserRole) {
      throw new HttpException('Error on the Database', 500);
    }
    const hashPassword = await argon.hash(dto.password);
    await this.prisma.user.create({
      data: { ...dto, roleId: existingUserRole.id, password: hashPassword },
    });
    return { message: 'Your account as been create !' };
  }
}
