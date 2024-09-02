import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Men', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ example: null, description: 'Parent category ID (null for root category)', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number; // Use number instead of string
}

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Mobile Phones', description: 'Name of the subcategory' })
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
  parentId?: number; // Use number instead of string
}
