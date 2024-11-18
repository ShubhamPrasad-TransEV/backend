import { IsString, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class ProductResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsString()
  imageUrl: string; // This should map to the image URL/path

  @IsArray()
  collections: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}
