import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { profileDTO } from './dto';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getMyProfile(@GetUser() user: User) {
    return this.userService.getMyProfile(user);
  }

  @Patch('profile')
  patchMyProfile(@GetUser() user: User, @Body() dto: profileDTO) {
    return this.userService.patchMyProfile(user, dto);
  }

  @Patch('disableMyAccount')
  disableMyAccount(@GetUser() user: User) {
    return this.userService.disableAccount(user);
  }
}
