import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtSrategy } from './strategy/jwt.strategy';
import { ResetPasswordSrategy } from './strategy/reset.password.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    ResetPasswordSrategy,
    JwtService,
    JwtSrategy,
    EmailService,
  ],
})
export class AuthModule {}
