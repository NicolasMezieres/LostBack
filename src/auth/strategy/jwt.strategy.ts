import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtSrategy extends PassportStrategy(Strategy, 'jwt') {
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
        isActive: true,
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('You are unauthorized');
    } else if (user.isActive === false) {
      throw new ForbiddenException('Your account is not active');
    }
    return user;
  }
}
