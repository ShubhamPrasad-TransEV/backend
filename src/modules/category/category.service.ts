import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create or update category/subcategory/nested subcategory using name for parent relationships
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, categoryParentName, subcategoryParentName } = createCategoryDto;

    // Fetch the parent category by name (instead of ID)
    let categoryParent = null;
    if (categoryParentName) {
      categoryParent = await this.prisma.category.findUnique({ where: { name: categoryParentName } });
      if (!categoryParent) throw new NotFoundException(`Category parent "${categoryParentName}" not found`);
    }

    // Fetch the parent subcategory by name (instead of ID)
    let subcategoryParent = null;
    if (subcategoryParentName) {
      subcategoryParent = await this.prisma.category.findUnique({ where: { name: subcategoryParentName } });
      if (!subcategoryParent) throw new NotFoundException(`Subcategory parent "${subcategoryParentName}" not found`);
    }

    // Upsert the category or subcategory based on the parent (using resolved names)
    return this.prisma.category.upsert({
      where: { name },  // Ensure name is unique
      update: {
        categoryParentId: categoryParent ? categoryParent.id : null,
        subcategoryParentId: subcategoryParent ? subcategoryParent.id : null,
      },
      create: {
        name,
        categoryParentId: categoryParent ? categoryParent.id : null,
        subcategoryParentId: subcategoryParent ? subcategoryParent.id : null,
      },
    });
  }

  // Update category or subcategory by name
  async updateCategory(name: string, updateCategoryDto: UpdateCategoryDto) {
    const { categoryParentName, subcategoryParentName } = updateCategoryDto;

    // Fetch the parent category by name if provided
    let categoryParent = null;
    if (categoryParentName) {
      categoryParent = await this.prisma.category.findUnique({ where: { name: categoryParentName } });
      if (!categoryParent) throw new NotFoundException(`Category parent "${categoryParentName}" not found`);
    }

    // Fetch the parent subcategory by name if provided
    let subcategoryParent = null;
    if (subcategoryParentName) {
      subcategoryParent = await this.prisma.category.findUnique({ where: { name: subcategoryParentName } });
      if (!subcategoryParent) throw new NotFoundException(`Subcategory parent "${subcategoryParentName}" not found`);
    }

    // Update the category or subcategory
    return this.prisma.category.update({
      where: { name },  // Ensure name is unique
      data: {
        categoryParentId: categoryParent ? categoryParent.id : null,
        subcategoryParentId: subcategoryParent ? subcategoryParent.id : null,
      },
    });
  }

  // Get category by name with its subcategories and nested subcategories
  async getCategoryByNameWithSubcategories(name: string) {
    return this.prisma.category.findUnique({
      where: { name },  // Ensure name is unique in the schema
      include: {
        subcategories: {
          include: {
            nestedSubcategories: true,
          },
        },
      },
    });
  }

  // Get subcategory by name with all categories it's under and its nested subcategories
  async getSubcategoryWithCategoriesAndNested(subcategoryName: string) {
    return this.prisma.category.findMany({
      where: { name: subcategoryName },
      include: {
        categoryParent: true,  // Ensure this is a valid relation in your schema
        nestedSubcategories: true,
      },
    });
  }

  // Get nested subcategory by name with all subcategories it's under and their categories
  async getNestedSubcategoryWithParentsAndCategories(nestedSubcategoryName: string) {
    return this.prisma.category.findMany({
      where: { name: nestedSubcategoryName },
      include: {
        subcategoryParent: {
          include: {
            categoryParent: true,  // Ensure this is a valid relation in your schema
          },
        },
      },
    });
  }

  // Delete category by name
  async deleteCategory(name: string) {
    return this.prisma.category.delete({
      where: { name },
    });
  }

  // Get categories without subcategories (root categories)
  async getCategoriesWithoutSubcategories() {
    return this.prisma.category.findMany({
      where: { categoryParentId: null },
    });
  }

  // Get category by name without its subcategories
  async getCategoryByNameWithoutSubcategories(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }
}
