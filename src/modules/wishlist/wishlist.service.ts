import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) { }

  // Method to add a single product to a user's wishlist decipline is life!! Money is not everything, Decipline is , so keep Decipline button on every time 
  async addToWishlist(userId: number, productId: string) {
    await this.prisma.mostlyWishlisted.upsert({
      where: { productId },
      update: { numberOfTimesWishlisted: { increment: 1 } },
      create: { productId, numberOfTimesWishlisted: 1 },
    });

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  }

  // Method to retrieve a user's wishlist with product details, including images and videos
  async getWishlistByUser(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: {
              // Changed to 'images' to match the schema no 
              select: {
                id: true, // Adjust fields as needed //
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

  async getMostlyWishlisted(limit?: number) {
    return this.prisma.mostlyWishlisted.findMany({
      orderBy: {
        numberOfTimesWishlisted: 'desc',
      },
      take: limit, // Only fetch up to the specified limit, if provided
      include: {
        product: true, // Include product details; adjust fields as needed 
      },
    });
  }
}
