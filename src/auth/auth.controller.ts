import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDTO, signupDTO } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: signupDTO) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: signinDTO, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(dto, res);
  }

  @Patch('activationAccount/:token')
  activationAccount(@Param('token') token: string) {
    return this.authService.activationAccount(token);
  }
}
