// update-product.dto.ts
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  images?: { filename: string; path: string }[]; // Include path instead of data
}
