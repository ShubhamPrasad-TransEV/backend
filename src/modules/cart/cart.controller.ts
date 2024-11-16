import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCart } from './dto/cart.dto'; // Adjust path as necessary

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/product/')
  async addToCart(
    @Body() body: { userId: number; productId: string; quantity?: number },
  ) {
    const { userId, productId } = body;
    const quantity = Number(body.quantity) || 1; // Default to 1 if not provided
    const addToCartDto: AddToCart = { userId, productId };
    return this.cartService.addToCart(addToCartDto, quantity);
  }

  // Fetch cart items using GET with query parameter 'userId'
  @Get('/getcartitems')
  async getCartItems(@Query('userId') userId: number) {
    if (!userId) {
      throw new Error('UserId is required');
    }
    return this.cartService.getCartItems(userId); // Call service to fetch cart items for user
  }

  @Delete('/removefromcart')
  async removeFromCart(@Body() body: { userId: number; productId: string }) {
    const { userId, productId } = body;
    return this.cartService.removeFromCart(userId, productId);
  }

  @Patch('/updatecart')
  async updateCartItemQuantity(
    @Body() body: { userId: number; productId: string; quantity: number },
  ) {
    const { userId, productId, quantity } = body;
    return this.cartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @Delete('/clearcart')
  async clearCart(@Body() body: { userId: number }) {
    const { userId } = body;
    return this.cartService.clearCart(userId);
  }
}
