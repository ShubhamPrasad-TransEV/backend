import { Controller, Post, Get, Delete, Patch, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/:userId/:productId') // Updated route
  async addToCart(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
    @Body() body: { quantity?: number } // Fetching quantity from body
  ) {
    const quantity = body.quantity || 1; // Default to 1 if not provided
    const addToCartDto: AddToCart = { userId, productId };
    return this.cartService.addToCart(addToCartDto, quantity);
  }

  @Get(':userId') // Updated route
  async getCartItems(@Param('userId') userId: number) {
    return this.cartService.getCartItems(userId);
  }

  @Delete(':userId/product/:productId') // Updated route
  async removeFromCart(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Patch('product/:userId/:productId/quantity') // Updated route
  async updateCartItemQuantity(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }, // Fetching quantity from body
  ) {
    const { quantity } = body; // Destructure quantity from body
    return this.cartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @Delete(':userId/clear') // Updated route
  async clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
