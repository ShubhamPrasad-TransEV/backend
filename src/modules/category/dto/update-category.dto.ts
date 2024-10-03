import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  categoryParentName?: string; // To update the category parent

  @IsOptional()
  @IsString()
  subcategoryParentName?: string; // To update the subcategory parent
}
