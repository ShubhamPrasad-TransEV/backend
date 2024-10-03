import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsInt()
  subcategoryId?: number; // Add this to handle updates to nestedSubcategories
}
