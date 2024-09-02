import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  parentId?: number;
}
