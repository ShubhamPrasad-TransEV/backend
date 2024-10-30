import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the product to add to wishlist',
  })
  productId: string;
}

export class MostlyWishlistedDto {
  @ApiPropertyOptional({
    description: 'The maximum number of mostly wishlisted items to retrieve',
  })
  limit?: number;
}
