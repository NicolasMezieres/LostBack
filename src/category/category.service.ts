import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categoryDTO } from './dto';
import { queryCategory } from 'src/utils/type';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async category(dto: categoryDTO) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (existingCategory) {
      throw new UnauthorizedException('This category already exists ');
    }

    const createCategory = await this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });
    return { message: 'Category create !' };
  }

  async getCategories(query: queryCategory) {
    const categoriesFound = await this.prisma.category.findMany({
      where: {
        name: {
          contains: query.search,
        },
      },
      take: 5,
    });
    if (!categoriesFound) {
      throw new NotFoundException('Name not found');
    }
    return {
      data: categoriesFound,
    };
  }

  async deleteCategory(enable: categoryDTO) {
    const deleteThisCategory = await this.prisma.category.delete({
      where: {
        name: enable.name,
      },
    });
    if (!deleteThisCategory) {
      throw new NotFoundException('No found category');
    }
    return { message: 'Category has been delete' };
  }
}
