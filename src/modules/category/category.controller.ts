import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch('name/:name')
  async updateCategory(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(name, updateCategoryDto);
  }

  @Get()
  async getAllCategoriesWithParentsAndChildren() {
    return this.categoriesService.getAllCategoriesWithParentsAndChildren();
  }

  @Get('up-tree/name/:name')
  async getUpTreeHierarchy(@Param('name') name: string) {
    return this.categoriesService.getUpTreeHierarchy(name);
  }

  @Get('down-tree/name/:name')
  async getDownTreeHierarchy(@Param('name') name: string) {
    return this.categoriesService.getDownTreeHierarchy(name);
  }

  @Delete('name/:name')
  async deleteCategory(@Param('name') name: string) {
    return this.categoriesService.deleteCategory(name);
  }
}
