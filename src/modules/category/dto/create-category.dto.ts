import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Clothing',
    description: 'Name of the category or subcategory',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Men's Fashion",
    description: 'Parent category name',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryParentName?: string; // Use this if the parent is a category

  @ApiProperty({
    example: 'Clothing',
    description: 'Parent subcategory name',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategoryParentName?: string; // Use this if the parent is a subcategory
}
