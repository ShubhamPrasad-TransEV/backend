import * as fs from 'fs';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a category and associate parents and children
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, parentCategoryNames, childCategoryNames } = createCategoryDto;
  
    // Check if the category already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });
  
    if (existingCategory) {
      throw new ConflictException(`Category with name "${name}" already exists`);
    }
  
    // Fetch parent categories by their names
    const parentCategories = parentCategoryNames
      ? await this.prisma.category.findMany({
          where: { name: { in: parentCategoryNames } },
        })
      : [];
  
    if (parentCategoryNames && parentCategories.length !== parentCategoryNames.length) {
      throw new NotFoundException(`Some parent categories not found`);
    }
  
    // Fetch child categories by their names
    let childCategories = childCategoryNames
      ? await this.prisma.category.findMany({
          where: { name: { in: childCategoryNames } },
        })
      : [];
  
    // Create missing child categories
    if (childCategoryNames && childCategories.length !== childCategoryNames.length) {
      const existingChildNames = childCategories.map((category) => category.name);
      const missingChildNames = childCategoryNames.filter(
        (name) => !existingChildNames.includes(name)
      );
  
      // Create missing child categories
      await this.prisma.category.createMany({
        data: missingChildNames.map((name) => ({
          name,
        })),
      });
  
      // Re-fetch all child categories after creating the missing ones
      childCategories = await this.prisma.category.findMany({
        where: { name: { in: childCategoryNames } },
      });
    }
  
    // Create the category with parent and child relations
    return this.prisma.category.create({
      data: {
        name,
        parentCategories: {
          connect: parentCategories.map((parent) => ({ id: parent.id })),
        },
        childCategories: {
          connect: childCategories.map((child) => ({ id: child.id })),
        },
      },
    });
  }

  // Update a category and associate parents and children
  async updateCategory(name: string, updateCategoryDto: UpdateCategoryDto) {
  const { parentCategoryNames, childCategoryNames } = updateCategoryDto;

  // Check if the category exists
  const category = await this.prisma.category.findUnique({
    where: { name },
  });

  if (!category) {
    throw new NotFoundException(`Category with name "${name}" not found`);
  }

  // Fetch parent categories by their names
  const parentCategories = parentCategoryNames
    ? await this.prisma.category.findMany({
        where: { name: { in: parentCategoryNames } },
      })
    : [];

  if (parentCategoryNames && parentCategories.length !== parentCategoryNames.length) {
    throw new NotFoundException(`Some parent categories not found`);
  }

  // Fetch child categories by their names
  let childCategories = childCategoryNames
    ? await this.prisma.category.findMany({
        where: { name: { in: childCategoryNames } },
      })
    : [];

  // Create missing child categories
  if (childCategoryNames && childCategories.length !== childCategoryNames.length) {
    const existingChildNames = childCategories.map((category) => category.name);
    const missingChildNames = childCategoryNames.filter(
      (name) => !existingChildNames.includes(name)
    );

    // Create missing child categories
    await this.prisma.category.createMany({
      data: missingChildNames.map((name) => ({
        name,
      })),
    });

    // Re-fetch all child categories after creating the missing ones
    childCategories = await this.prisma.category.findMany({
      where: { name: { in: childCategoryNames } },
    });
  }

  // Update the category with parent and child relations
  return this.prisma.category.update({
    where: { name },
    data: {
      name: updateCategoryDto.name,
      parentCategories: {
        set: parentCategories.map((parent) => ({ id: parent.id })),
      },
      childCategories: {
        set: childCategories.map((child) => ({ id: child.id })),
      },
    },
  });
}

  // Get all categories with their immediate parents and children
  async getAllCategoriesWithParentsAndChildren() {
    return this.prisma.category.findMany({
      include: {
        parentCategories: true,
        childCategories: true,
      },
    });
  }

  // Get up-tree hierarchy
  async getUpTreeHierarchy(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
      include: { parentCategories: true },
    });
  
    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found`);
    }
  
    return this.getRecursiveParents(category);
  }
  
  // Helper function to recursively fetch parent categories (full hierarchy)
  private async getRecursiveParents(category) {
    const parents = await this.prisma.category.findMany({
      where: { id: { in: category.parentCategories.map((p) => p.id) } },
      include: { parentCategories: true },
    });
  
    if (parents.length === 0) return {
      id: category.id,
      name: category.name,
      parents: [],
    };
  
    const result = {
      id: category.id,
      name: category.name,
      parents: [],
    };
  
    // Recursively get parents for each parent category
    for (const parent of parents) {
      const parentTree = await this.getRecursiveParents(parent);
      result.parents.push(parentTree); // Append the full parent tree recursively
    }
  
    return result;
  }
  // Get down-tree hierarchy
  async getDownTreeHierarchy(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
      include: { childCategories: true },
    });
  
    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found`);
    }
  
    return this.getRecursiveChildren(category);
  }
  
  // Helper function to recursively fetch child categories (full hierarchy)
  private async getRecursiveChildren(category) {
    const children = await this.prisma.category.findMany({
      where: { id: { in: category.childCategories.map((c) => c.id) } },
      include: { childCategories: true },
    });
  
    if (children.length === 0) return {
      id: category.id,
      name: category.name,
      children: [],
    };
  
    const result = {
      id: category.id,
      name: category.name,
      children: [],
    };
  
    // Recursively get children for each child category
    for (const child of children) {
      const childTree = await this.getRecursiveChildren(child);
      result.children.push(childTree); // Append the full child tree recursively
    }
  
    return result;
  }

  async deleteCategory(name: string) {
    // Fetch the category to delete with its parent and child relations
    const category = await this.prisma.category.findUnique({
      where: { name },
      include: {
        parentCategories: true,
        childCategories: true,
      },
    });
  
    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found`);
    }
  
    // Remove the relations to parent categories by disconnecting the parent category IDs
    await this.prisma.category.update({
      where: { id: category.id },
      data: {
        parentCategories: {
          disconnect: category.parentCategories.map((parent) => ({ id: parent.id })), // Disconnect from all parent categories using their IDs
        },
      },
    });
  
    // Process the child categories recursively (check if they have other parents and delete them if they don't)
    await this.deleteChildCategoriesRecursively(category.id);
  
    // Finally, delete the category itself
    return this.prisma.category.delete({
      where: { id: category.id },
    });
  }

  // Helper method to recursively delete child categories
  private async deleteChildCategoriesRecursively(categoryId: number) {
    // Fetch the category along with its parent and child categories
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parentCategories: true, // Include parent categories to disconnect
        childCategories: true,  // Include child categories to check for deletion
      },
    });
  
    // If the category doesn't exist, return early
    if (!category) {
      return;
    }
  
    // For each child category, check if it has any other parents
    for (const child of category.childCategories) {
      const parentCount = await this.prisma.category.count({
        where: {
          childCategories: {
            some: {
              id: child.id,
            },
          },
        },
      });
  
      // If this child has no other parents, recursively delete it
      if (parentCount <= 1) {
        // First, disconnect all parent relations for the child category
        await this.prisma.category.update({
          where: { id: child.id },
          data: {
            parentCategories: {
              disconnect: category.parentCategories.map((parent) => ({ id: parent.id })), // Disconnect parent categories using their IDs
            },
          },
        });
  
        // Recursively delete the child category
        await this.deleteChildCategoriesRecursively(child.id);
  
        // Finally, check if the child category still exists before deleting it
        const childCategoryExists = await this.prisma.category.findUnique({
          where: { id: child.id },
        });
  
        if (childCategoryExists) {
          // Delete the child category
          await this.prisma.category.delete({
            where: { id: child.id },
          });
        }
      } else {
        // If the child has other parents, just disconnect this specific parent (the current category)
        await this.prisma.category.update({
          where: { id: child.id },
          data: {
            parentCategories: {
              disconnect: {
                id: categoryId, // Disconnect the current category from this child
              },
            },
          },
        });
      }
    }
  
    // After processing the child categories, check if the category still exists before deleting it
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  
    if (categoryExists) {
      await this.prisma.category.delete({
        where: { id: categoryId },
      });
    }
  }
  async createCategoriesFromFile(filePath: string) {
    const categoryPaths = this.parseTaxonomyFile(filePath);

    // Process each category path
    for (const categoryPath of categoryPaths) {
      await this.createCategoriesRecursively(categoryPath);
    }
  }

  // Parse taxonomy file and extract category paths
  private parseTaxonomyFile(filePath: string): string[][] {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContents.split('\n').filter(line => line.trim() !== '');

    const categories = lines.map(line => line.trim().split(' > '));  // Split by ' > ' delimiter
    return categories;  // Array of category paths (arrays of strings)
  }

  // Recursive method to create or link categories and their relationships
  async createCategoriesRecursively(categoryPath: string[]) {
    const categoryName = categoryPath.pop();  // Get the last category in the path
    const parentCategoryNames = categoryPath.length > 0 ? categoryPath : null;  // Remaining categories are parents

    // Check if the category already exists
    let category = await this.prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      // Create missing parent categories recursively
      let parentCategories = [];
      if (parentCategoryNames) {
        parentCategories = await Promise.all(
          parentCategoryNames.map(async (parentName) => {
            const parentCategory = await this.createCategoriesRecursively([...categoryPath]);  // Recurse for each parent
            return parentCategory;
          })
        );
      }

      // Create the new category
      category = await this.prisma.category.create({
        data: {
          name: categoryName,
          parentCategories: {
            connect: parentCategories.map((parent) => ({ id: parent.id })),
          },
        },
      });
    }

    // If parent categories exist, ensure they are linked to the category
    if (parentCategoryNames) {
      const parentCategories = await this.prisma.category.findMany({
        where: { name: { in: parentCategoryNames } },
      });

      await this.prisma.category.update({
        where: { id: category.id },
        data: {
          parentCategories: {
            connect: parentCategories.map((parent) => ({ id: parent.id })),
          },
        },
      });
    }

    return category;
  }
}  

