import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDto) {
    const { userId, productId, quantity } = addToCartDto;

    // Check if the product already exists in the cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      // Update the quantity if the product already exists
      return this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // Create a new cart item
      return this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  }

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true, // Include product information if needed
      },
    });
  }

  // cart.service.ts
  async removeFromCart(userId: number, productId: number): Promise<void> {
    // Check if the cart item exists for the user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in the cart');
    }

    // Remove the item from the cart
    await this.prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });
  }
}
