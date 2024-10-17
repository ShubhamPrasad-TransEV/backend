import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // Method to add a single product to a user's wishlist
  async addToWishlist(userId: number, productId: string) {
    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  }

  // Method to retrieve a user's wishlist with product details
  async getWishlistByUser(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true, // Assuming a relation exists between wishlist and product
      },
    });
  }

  // Method to remove a product from a user's wishlist
  async removeFromWishlist(userId: number, productId: string) {
    return this.prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }
}
