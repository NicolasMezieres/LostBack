import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard, JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { profileDTO } from './dto';
import { queryUser } from 'src/utils/type';
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
  @UseGuards(AdminGuard)
  @Get('/statistic')
  getStatistic() {
    return this.userService.getStatistic();
  }
  @UseGuards(AdminGuard)
  @Get('/')
  getAllUser(@Query() query: queryUser) {
    return this.userService.getAllUser(query);
  }
  @UseGuards(AdminGuard)
  @Patch("/banishment/:id")
  banUser(@Param("id") id :string){
    return this.userService.banUser(id);
  }
  @UseGuards(AdminGuard)
  @Patch("/remove/:id")
  removeUser(@Param("id") id :string){
    return this.userService.removeUser(id);
  }
}
