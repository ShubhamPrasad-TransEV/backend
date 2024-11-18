// collection-response.dto.ts
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CollectionResponseDto {
  @IsString()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  createdAt: string; // ISO string

  @IsArray()
  @IsOptional()
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    imageUrl: string;
  }[];
}
