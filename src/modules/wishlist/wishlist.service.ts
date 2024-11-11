import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // Method to add a single product to a user's wishlist
  async addToWishlist(userId: number, productId: string) {
    const userintid = Number(userId);
    await this.prisma.mostlyWishlisted.upsert({
      where: { productId },
      update: { numberOfTimesWishlisted: { increment: 1 } },
      create: { productId, numberOfTimesWishlisted: 1 },
    });

    return this.prisma.wishlist.create({
      data: {
        userId: userintid,
        productId,
      },
    });
  }

  // Method to retrieve a user's wishlist with product details, including images
  async getWishlistByUser(userId: number) {
    const userintid = Number(userId);
    return this.prisma.wishlist.findMany({
      where: { userId: userintid },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: {
              // Changed to 'images' to match the schema
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
    const userintid = Number(userId);
    return this.prisma.wishlist.deleteMany({
      where: {
        userId: userintid,
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
