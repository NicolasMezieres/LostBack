import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  forgetPasswordDTO,
  ResetPasswordDTO,
  signinDTO,
  signupDTO,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Role } from 'src/utils/enum';
import { EmailService } from 'src/email/email.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

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
    const activationToken = await argon.hash(dto.password + dto.email);
    const newToken = activationToken.replaceAll('/', '');
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        roleId: existingUserRole.id,
        password: hashPassword,
        activationToken: newToken,
      },
    });
    await this.email.accountConfirmation(newUser, newToken);
    return { message: 'Your account as been create !' };
  }

  async activationAccount(token: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { activationToken: token },
    });
    if (!existingUser) {
      throw new NotFoundException('Account not found');
    }
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { activationToken: '', isActive: true },
    });
    return { message: 'Your account is active !' };
  }
  async signToken(user: User, delay: string) {
    const payload = { sub: user.id };
    return {
      connexion_token: await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: delay,
      }),
    };
  }
  async signin(dto: signinDTO, res: Response) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { username: dto.identifier }],
      },
      include: { role: true },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credential');
    } else if (existingUser.isActive === false) {
      throw new UnauthorizedException('Your account is not active');
    }
    const isSamePassword = await argon.verify(
      existingUser.password,
      dto.password,
    );
    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid credential');
    }
    const token = await this.signToken(existingUser, '1d');
    res.cookie('access_token', token.connexion_token, {
      // permet au cookie d'être accessible uniquement au serveur web
      httpOnly: true,
      //strict si c'est le front et le back on le même url sinon none
      sameSite: 'none',
      //durée du cookie
      maxAge: 1000 * 60 * 60 * 24 * 7,
      //est ce que le cookie doit provenir d'un https et est ce que c'est le même nom de domaine entre back et front
      secure: process.env.IS_PRODUCTION === 'true' ? true : false,
    });
    return {
      message: 'Connexion succesfully',
      role: existingUser.role.name,
    };
  }

  async forgetPassword(dto: forgetPasswordDTO) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail && existingEmail.isActive) {
      const token = await this.signToken(existingEmail, '10m');
      this.email.forgetPassword(existingEmail, token.connexion_token);
    } else if (existingEmail && !existingEmail.isActive) {
      return { message: 'Your account is not active' };
    }
    return { message: 'Check your email' };
  }

  async resetPassword(user: User, dto: ResetPasswordDTO) {
    const hash = await argon.hash(dto.password);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });
    return { message: 'Password change, congratulations !' };
  }
}
