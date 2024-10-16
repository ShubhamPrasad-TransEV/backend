import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';  // Import PrismaService to communicate with the database

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}  // Inject PrismaService in the constructor

  // Method to add a product to a user's wishlist without product ID verification
  async addToWishlist(userId: number, productId: number) {
    // Directly create the wishlist entry
    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  }

  // Method to retrieve a user's wishlist
  async getWishlistByUser(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },  // Find all wishlist items by userId
      include: {
        product: true,  // Assuming a relation exists between wishlist and product
      },
    });
  }
}
