import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/wishlist.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add a product to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'The product has been added to the wishlist.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async addToWishlist(@Body() addToWishlistDto: AddToWishlistDto) {
    const { userId, productId } = addToWishlistDto;
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get wishlist for a user' })
  @ApiResponse({ status: 200, description: 'The wishlist for the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getWishlist(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.getWishlistByUser(userId);
  }

  @Delete(':userId/:productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({
    status: 200,
    description: 'The product has been removed from the wishlist.',
  })
  @ApiResponse({ status: 404, description: 'Product or User not found.' })
  async removeFromWishlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
