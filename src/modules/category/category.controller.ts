import { Controller, Post, Patch, Delete, Body, Param, Get } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto, CreateSubcategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a new category
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Create a new subcategory
  @Post('subcategory')
  async createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.categoriesService.createSubcategory(createSubcategoryDto);
  }

  // Create a new nested subcategory
  @Post('subcategory/nested')
  async createNestedSubcategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createNestedSubcategory(createCategoryDto);
  }

  // Get all categories without subcategories
  @Get()
  async getCategories() {
    return this.categoriesService.getCategoriesWithoutSubcategories();
  }

  // Get a category by ID without subcategories
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryByIdWithoutSubcategories(Number(id));
  }

  // Get a category by name without subcategories
  @Get('name/:name')
  async getCategoryByName(@Param('name') name: string) {
    return this.categoriesService.getCategoryByNameWithoutSubcategories(name);
  }

  // Get subcategories by category ID
  @Get(':id/subcategories')
  async getSubcategoriesByCategoryId(@Param('id') id: string) {
    return this.categoriesService.getSubcategoriesByCategoryId(Number(id));
  }

  // Get nested subcategories by subcategory ID
  @Get('subcategory/:id/nested')
  async getNestedSubcategoriesBySubcategoryId(@Param('id') id: string) {
    return this.categoriesService.getNestedSubcategoriesBySubcategoryId(Number(id));
  }

  // Get a subcategory by name
  @Get('subcategory/name/:name')
  async getSubcategoryByName(@Param('name') name: string) {
    return this.categoriesService.getSubcategoryByName(name);
  }

  // Update a category by ID
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(Number(id), updateCategoryDto);
  }

  // Update a subcategory by name
  @Patch('subcategory/:name')
  async updateSubcategory(@Param('name') name: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateSubcategory(name, updateCategoryDto);
  }

  // Update a nested subcategory by ID
  @Patch('subcategory/nested/:id')
  async updateNestedSubcategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateNestedSubcategory(Number(id), updateCategoryDto);
  }

  // Delete a category by ID
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }

  // Delete a subcategory by name
  @Delete('subcategory/:name')
  async deleteSubcategory(@Param('name') name: string) {
    return this.categoriesService.deleteSubcategory(name);
  }

  // Delete a nested subcategory by ID
  @Delete('subcategory/nested/:id')
  async deleteNestedSubcategory(@Param('id') id: string) {
    return this.categoriesService.deleteNestedSubcategory(Number(id));
  }
}
