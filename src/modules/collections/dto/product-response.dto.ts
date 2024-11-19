import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  createdAt: string;

  @Expose()
  imageUrl: string;

  @Expose()
  category: string; // Add this line

  @Expose()
  collections: Array<{ id: string; name: string; description: string }>;
}
