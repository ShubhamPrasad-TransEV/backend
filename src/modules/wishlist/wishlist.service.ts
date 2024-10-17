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

  // Method to retrieve a user's wishlist with product details, including images
  async getWishlistByUser(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: { // Changed to 'images' to match the schema
              select: {
                id: true, // Adjust fields as needed
                filename: true,
                path: true, // Include path if necessary for your application
              },
            },
            // Include any other necessary fields
          },
        },
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
