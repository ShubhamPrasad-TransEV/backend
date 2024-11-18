import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CollectionResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsDateString()
  createdAt: string;

  @IsArray()
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    imageUrl: string; // Image URL for products
  }>;
}
