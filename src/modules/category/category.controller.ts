// import { Controller, Post, Patch, Delete, Body, Param, Get } from '@nestjs/common';
// import { CategoriesService } from './category.service';
// import { CreateCategoryDto, CreateSubcategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

// @Controller('categories')
// export class CategoriesController {
//   constructor(private readonly categoriesService: CategoriesService) {}

//   // Create a new category
//   @Post()
//   async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
//     return this.categoriesService.createCategory(createCategoryDto);
//   }

//   // Create a new subcategory
//   @Post('subcategory')
//   async createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
//     return this.categoriesService.createSubcategory(createSubcategoryDto);
//   }

//   // Get all categories
//   @Get()
//   async getCategories() {
//     return this.categoriesService.getCategories();
//   }

//   // Get a category by ID
//   @Get(':id')
//   async getCategoryById(@Param('id') id: string) {
//     return this.categoriesService.getCategoryById(Number(id));
//   }

   
   

//   // Get a category by name
//   @Get('name/:name')
//   async getCategoryByName(@Param('name') name: string) {
//     return this.categoriesService.getCategoryByName(name);
//   }

//   // Get subcategories by category ID
//   @Get(':id/subcategories')
//   async getSubcategoriesByCategoryId(@Param('id') id: string) {
//     return this.categoriesService.getSubcategoriesByCategoryId(Number(id));
//   }

//   // Get all subcategories
//   @Get('subcategories')
//   async getAllSubcategories() {
//     return this.categoriesService.getAllSubcategories();
//   }

//   // Update a category by ID
//   @Patch(':id')
//   async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
//     return this.categoriesService.updateCategory(Number(id), updateCategoryDto);
//   }

//   // Update a subcategory by name
//   @Patch('subcategory/:name')
//   async updateSubcategory(@Param('name') name: string, @Body() updateCategoryDto: UpdateCategoryDto) {
//     return this.categoriesService.updateSubcategory(name, updateCategoryDto);
//   }

//   // Delete a category by ID
//   @Delete(':id')
//   async deleteCategory(@Param('id') id: string) {
//     return this.categoriesService.deleteCategory(Number(id));
//   }

//   // Delete a subcategory by name
//   @Delete('subcategory/:name')
//   async deleteSubcategory(@Param('name') name: string) {
//     return this.categoriesService.deleteSubcategory(name);
//   }
// }

// import { Controller, Post, Patch, Delete, Body, Param, Get } from '@nestjs/common';
// import { CategoriesService } from './category.service';
// import { CreateCategoryDto, CreateSubcategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

// @Controller('categories')
// export class CategoriesController {
//   constructor(private readonly categoriesService: CategoriesService) {}

//   // Create a new category
//   @Post()
//   async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
//     return this.categoriesService.createCategory(createCategoryDto);
//   }

//   // Create a new subcategory
//   @Post('subcategory')
//   async createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
//     return this.categoriesService.createSubcategory(createSubcategoryDto);
//   }

//   // Get all categories without subcategories
//   @Get()
//   async getCategories() {
//     return this.categoriesService.getCategoriesWithoutSubcategories();
//   }

//   // Get a category by ID without subcategories
//   @Get(':id')
//   async getCategoryById(@Param('id') id: string) {
//     return this.categoriesService.getCategoryByIdWithoutSubcategories(Number(id));
//   }

//   // Get a category by name without subcategories
//   @Get('name/:name')
//   async getCategoryByName(@Param('name') name: string) {
//     return this.categoriesService.getCategoryByNameWithoutSubcategories(name);
//   }

//   // Get subcategories by category ID
//   @Get(':id/subcategories')
//   async getSubcategoriesByCategoryId(@Param('id') id: string) {
//     return this.categoriesService.getSubcategoriesByCategoryId(Number(id));
//   }

//   // Get all subcategories
//   @Get('subcategories')
//   async getAllSubcategories() {
//     return this.categoriesService.getAllSubcategories();
//   }

//   // Update a category by ID
//   @Patch(':id')
//   async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
//     return this.categoriesService.updateCategory(Number(id), updateCategoryDto);
//   }

//   // Update a subcategory by name
//   @Patch('subcategory/:name')
//   async updateSubcategory(@Param('name') name: string, @Body() updateCategoryDto: UpdateCategoryDto) {
//     return this.categoriesService.updateSubcategory(name, updateCategoryDto);
//   }

//   // Delete a category by ID
//   @Delete(':id')
//   async deleteCategory(@Param('id') id: string) {
//     return this.categoriesService.deleteCategory(Number(id));
//   }

//   // Delete a subcategory by name
//   @Delete('subcategory/:name')
//   async deleteSubcategory(@Param('name') name: string) {
//     return this.categoriesService.deleteSubcategory(name);
//   }
// }

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
}
