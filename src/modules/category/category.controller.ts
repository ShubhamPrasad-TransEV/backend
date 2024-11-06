import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './category.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

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

  @Get('subcategories/name/:name')
  async getSubcategories(@Param('name') name: string) {
    return this.categoriesService.getSubcategories(name);
  }

  // New endpoint to fetch top-level categories
  @Get('top-level')
  async getTopLevelCategories() {
    return this.categoriesService.getTopLevelCategories();
  }

  @Post('import')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute file path of the taxonomy file',
          example: './src/Google_Product_Taxonomy_Version 2.txt',
        },
      },
    },
  })
  async createCategoriesFromFile(@Body('filePath') filePath: string) {
    return this.categoriesService.createCategoriesFromFile(filePath);
  }

  @Get('search/name')
  async searchProducts(@Query('term') term: string) {
    if (!term || term.trim() === '') {
      throw new BadRequestException('Search term cannot be empty');
    }
    return this.categoriesService.searchCategories(term);
  }
}
