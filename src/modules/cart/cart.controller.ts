import { Body, Controller, Post, Get, Param,Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-cart.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiBody({
    description: 'Payload for ADMIN creation',
    type: AddToCartDto,
    examples: {
        example1: {
            summary: 'Add to cart example',
            value: {
                userId : 1,
                productId :2,
                quantity: 3
            },
        },
    },
})
@ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: AddToCartDto,
})
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get(':userId')
  async getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }
  @Delete(':userId/:productId')
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found in cart',
  })
  async removeFromCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    await this.cartService.removeFromCart(userId, productId);
    return { message: 'Item removed from cart successfully' };
  }
}
