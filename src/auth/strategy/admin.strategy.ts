import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/utils/enum';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req.cookies || !req.cookies['access_token']) {
          return null;
        }
        return req.cookies['access_token'];
      },
      secretOrKey: config.get('JWT_SECRET') as string,
    });
  }
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user || user.role.name !== Role.ADMIN) {
      throw new UnauthorizedException('You are Unauthorized');
    }
    return user;
  }
}
