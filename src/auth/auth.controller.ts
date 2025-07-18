import {
  Body,
  Controller,
  Header,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  signinDTO,
  signupDTO,
  forgetPasswordDTO,
  ResetPasswordDTO,
} from './dto';
import { Response } from 'express';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { ResetPasswordGuard } from './guards/reset.password.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgetPassword')
  forgetPassword(@Body() dto: forgetPasswordDTO) {
    return this.authService.forgetPassword(dto);
  }

  @Post('signup')
  signup(@Body() dto: signupDTO) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: signinDTO, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(dto, res);
  }
  @UseGuards(ResetPasswordGuard)
  @Patch('resetPassword')
  resetPassword(@GetUser() user: User, @Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(user, dto);
  }

  @Patch('activationAccount/:token')
  activationAccount(@Param('token') token: string) {
    return this.authService.activationAccount(token);
  }
}
