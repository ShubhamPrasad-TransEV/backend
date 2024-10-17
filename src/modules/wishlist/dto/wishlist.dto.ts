import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  userId: number;

  @ApiProperty({ example: 1, description: 'The ID of the product to add to wishlist' })
  productId: string;
}
