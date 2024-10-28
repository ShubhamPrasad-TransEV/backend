import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/cart/add/:productId') // Updated route
  async addToCart(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number = 1,
  ) {
    const addToCartDto: AddToCart = { userId, productId };
    return this.cartService.addToCart(addToCartDto, quantity);
  }

  @Get(':userId/cart') // Updated route
  async getCartItems(@Param('userId') userId: number) {
    return this.cartService.getCartItems(userId);
  }

  @Delete(':userId/cart/product/:productId') // Updated route
  async removeFromCart(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Patch(':userId/cart/product/:productId/quantity') // Updated route
  async updateCartItemQuantity(
    @Param('userId') userId: number,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @Delete(':userId/cart/clear') // Updated route
  async clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
