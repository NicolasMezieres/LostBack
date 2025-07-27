import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { AnnoncementModule } from './annoncement/annoncement.module';
import { CategoryModule } from './category/category.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule,
    AuthModule,
    EmailModule,
    UserModule,
    AnnoncementModule,
    CategoryModule,
    MessagesModule,
  ],
})
export class AppModule {}
