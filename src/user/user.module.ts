import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAdminStrategy } from 'src/auth/strategy/admin.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtAdminStrategy],
})
export class UserModule {}
