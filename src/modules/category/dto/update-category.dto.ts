import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  parentCategoryNames?: string[]; // List of parent category names

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  childCategoryNames?: string[]; // List of child category names
}
