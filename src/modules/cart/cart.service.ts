import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCart, quantity: number) {
    const { userId, productId } = addToCartDto;

    // Ensure userId is an integer
    const userIdInt = Number(userId);
    if (isNaN(userIdInt)) {
      throw new NotFoundException('Invalid user ID');
    }

    // Check if the product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if the requested quantity exceeds available quantity
    if (quantity > product.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    // Check if the item already exists in the cart
    const existingItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: userIdInt,
          productId,
        },
      },
    });

    if (existingItem) {
      // If it exists, update the quantity instead of creating a new entry
      const newQuantity = existingItem.quantity + quantity;

      // Check if the updated quantity exceeds available stock
      if (newQuantity > product.quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      return this.prisma.cart.update({
        where: {
          userId_productId: {
            userId: userIdInt,
            productId,
          },
        },
        data: { quantity: newQuantity }, // Increment the existing quantity
      });
    }

    // Create a new entry in the cart
    return this.prisma.cart.create({
      data: {
        userId: userIdInt,
        productId,
        quantity,
      },
    });
  }

  async getCartItems(userId: number) {
    const userIdInt = Number(userId);
    // if (isNaN(userIdInt)) {
    //   throw new NotFoundException('Invalid user ID');
    // }

    const cartItems = await this.prisma.cart.findMany({
      where: { userId: userIdInt },
      include: { product: true }, // Include product details if needed
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('No items found in the cart');
    }

    return cartItems;
  }

  async removeFromCart(userId: number, productId: string) {
    const userIdInt = Number(userId);
    // if (isNaN(userIdInt)) {
    //   throw new NotFoundException('Invalid user ID');
    // }

    const result = await this.prisma.cart.deleteMany({
      where: {
        userId: userIdInt,
        productId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Item not found in the cart');
    }

    return { message: 'Item removed from cart successfully' };
  }

  async updateCartItemQuantity(userId: number, productId: string, quantity: number) {
    const userIdInt = Number(userId);
    const quantityInt = Number(quantity)
    // if (isNaN(userIdInt)) {
    //   throw new NotFoundException('Invalid user ID');
    // }

    const result = await this.prisma.cart.updateMany({
      where: {
        userId: userIdInt,
        productId,
      },
      data: {
        quantity:quantityInt, // Update to the new quantity
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Item not found in the cart');
    }

    return { message: 'Item quantity updated successfully' };
  }

  async clearCart(userId: number) {
    const userIdInt = Number(userId);
    // if (isNaN(userIdInt)) {
    //   throw new NotFoundException('Invalid user ID');
    // }

    await this.prisma.cart.deleteMany({
      where: { userId: userIdInt },
    });

    return { message: 'Cart cleared successfully' };
  }
}
