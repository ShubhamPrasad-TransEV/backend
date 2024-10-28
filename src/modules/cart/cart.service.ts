import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCart, quantity: number) {
    const { userId, productId } = addToCartDto;

    // Check if the product exists before adding to the cart
    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    // Check if the item already exists in the cart
    const existingItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // If it exists, update the quantity instead of creating a new entry
      return this.prisma.cart.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: { quantity: existingItem.quantity + quantity }, // Increment the existing quantity
      });
    }

    // Create a new entry in the cart
    return this.prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async getCartItems(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: { product: true }, // Include product details if needed
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('No items found in the cart');
    }

    return cartItems;
  }

  async removeFromCart(userId: number, productId: string) {
    const result = await this.prisma.cart.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Item not found in the cart');
    }

    return { message: 'Item removed from cart successfully' };
  }

  async updateCartItemQuantity(
    userId: number,
    productId: string,
    quantity: number,
  ) {
    const result = await this.prisma.cart.updateMany({
      where: {
        userId,
        productId,
      },
      data: {
        quantity, // Update to the new quantity
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Item not found in the cart');
    }

    return { message: 'Item quantity updated successfully' };
  }

  async clearCart(userId: number) {
    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return { message: 'Cart cleared successfully' };
  }
}
