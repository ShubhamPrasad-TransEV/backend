import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Men', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ example: null, description: 'Parent category ID (null for root category)', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;
  
  @ApiProperty({ example: null, description: 'Subcategory ID (null if no subcategory)', required: false })
  @IsOptional()
  @IsInt()
  subcategoryId?: number; // Add this to handle nestedSubcategories
}

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Shirt', description: 'Name of the subcategory' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Men', description: 'Name of the parent category' })
  @IsString()
  parentCategoryName: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Men', description: 'Name of the category' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: null, description: 'Parent category ID (null for root category)', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ example: null, description: 'Subcategory ID (null if no subcategory)', required: false })
  @IsOptional()
  @IsInt()
  subcategoryId?: number; // Add this to handle updates to nestedSubcategories
}
