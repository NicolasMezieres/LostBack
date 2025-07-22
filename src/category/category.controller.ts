import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDTO } from './dto';
import { queryCategory } from 'src/utils/type';
import { AdminGuard, JwtGuard } from 'src/auth/guards';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(JwtGuard)
  @Post('createCategory')
  createCategory(@Body() dto: categoryDTO) {
    return this.categoryService.category(dto);
  }

  @Get('getCategories')
  getCategories(@Query() search: queryCategory) {
    return this.categoryService.getCategories(search);
  }

  @UseGuards(AdminGuard)
  @Delete('deleteCategory')
  deleteCategory(@Body() enable: categoryDTO) {
    return this.categoryService.deleteCategory(enable);
  }
}
