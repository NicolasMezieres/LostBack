import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://lost-web-nicolasmezieres-nicolas-projects-d55648f9.vercel.app',
      'http://localhost:4200',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
