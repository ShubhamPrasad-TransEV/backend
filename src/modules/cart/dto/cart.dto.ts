import { ApiProperty } from '@nestjs/swagger';

export class AddToCart {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the product that has been added to the cart', // Fixed typo
  })
  productId: string; // Assuming productId should remain a string
}
