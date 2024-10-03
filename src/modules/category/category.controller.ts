import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create or update category or subcategory
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Update category or subcategory by name
  @Patch('name/:name')
  async updateCategory(@Param('name') name: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(name, updateCategoryDto);
  }

  // Get category by name with its subcategories and nested subcategories
  @Get('name/:name/subcategories')
  async getCategoryWithSubcategories(@Param('name') name: string) {
    return this.categoriesService.getCategoryByNameWithSubcategories(name);
  }

  // Get subcategory by name and return all categories it's under and its nested subcategories
  @Get('subcategory/name/:name/categories-and-nested')
  async getSubcategoryWithCategoriesAndNested(@Param('name') name: string) {
    return this.categoriesService.getSubcategoryWithCategoriesAndNested(name);
  }

  // Get nested subcategory by name and return all subcategories it's under and their categories
  @Get('subcategory/nested/name/:name/parents-and-categories')
  async getNestedSubcategoryWithParentsAndCategories(@Param('name') name: string) {
    return this.categoriesService.getNestedSubcategoryWithParentsAndCategories(name);
  }

  // Delete category by name
  @Delete('name/:name')
  async deleteCategory(@Param('name') name: string) {
    return this.categoriesService.deleteCategory(name);
  }

  // Get categories without subcategories (root categories)
  @Get()
  async getCategoriesWithoutSubcategories() {
    return this.categoriesService.getCategoriesWithoutSubcategories();
  }

  // Get category by name without its subcategories
  @Get('name/:name')
  async getCategoryByNameWithoutSubcategories(@Param('name') name: string) {
    return this.categoriesService.getCategoryByNameWithoutSubcategories(name);
  }
}
