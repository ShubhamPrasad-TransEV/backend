import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCart, quantity: number) {
    const { userId, productId } = addToCartDto;
    const userIdInt = Number(userId);
    const quantityInt = Number(quantity); // Ensure quantity is treated as a number

    if (isNaN(userIdInt) || isNaN(quantityInt)) {
      throw new NotFoundException('Invalid user ID or quantity');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if item already exists in the cart
    const existingItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: userIdInt,
          productId,
        },
      } as any, // Bypass type checking temporarily
    });

    // Calculate new quantity based on existing item
    let newQuantity;

    if (existingItem) {
      newQuantity = existingItem.quantity + quantityInt; // Existing quantity plus newly added quantity
      console.log(`Item exists. New total quantity will be ${newQuantity}.`);
    } else {
      newQuantity = quantityInt; // Only the newly added quantity if it doesn't exist
      console.log(
        `Item does not exist. New total quantity will be ${newQuantity}.`,
      );
    }

    // Debugging output
    console.log(`Adding ${quantityInt} to cart.`);
    console.log(
      `Existing quantity in cart: ${existingItem ? existingItem.quantity : 0}`,
    );
    console.log(`Total new quantity: ${newQuantity}`);
    console.log(`Available stock: ${product.quantity}`);

    // Check if there is enough stock available
    if (product.quantity <= 0) {
      console.log(`No stock available for product ID ${productId}.`);
      throw new BadRequestException('Not enough stock available');
    }

    // Update existing item in cart or create a new entry
    if (existingItem) {
      await this.prisma.cart.update({
        where: {
          userId_productId: {
            userId: userIdInt,
            productId,
          },
        } as any, // Bypass type checking temporarily
        data: { quantity: newQuantity }, // Update to new calculated quantity
      });
      console.log(`Updated cart item with new quantity ${newQuantity}.`);
    } else {
      await this.prisma.cart.create({
        data: {
          userId: userIdInt,
          productId,
          quantity: quantityInt, // Use integer value for creation
        },
      });
      console.log(`Created new cart entry with quantity ${quantityInt}.`);
    }

    // Update Product quantity after confirming enough stock is available
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity - Math.min(quantityInt, product.quantity),
      }, // Deduct only what can be added
    });

    // Log to quantity management with correct values
    await this.prisma.quantitymanagement.create({
      data: {
        currentquantity: product.quantity,
        afterupdatequantity: Math.max(
          product.quantity - Math.min(quantityInt, product.quantity),
          0,
        ), // Log what it will be after deduction
      },
    });

    return { message: 'Product added to cart successfully' };
  }

  async getCartItems(userId: number) {
    const userIdInt = Number(userId);

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

    const existingItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: userIdInt,
          productId,
        },
      } as any, // Bypass type checking temporarily
    });

    if (!existingItem) {
      throw new NotFoundException('Item not found in the cart');
    }

    // Find the product to get its current stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calculate the new quantity for the product
    const updatedQuantity = product.quantity + existingItem.quantity;

    // Update Product quantity correctly
    await this.prisma.product.update({
      where: { id: product.id },
      data: { quantity: updatedQuantity },
    });

    // Log to quantity management with correct values
    await this.prisma.quantitymanagement.create({
      data: {
        currentquantity: product.quantity,
        afterupdatequantity: updatedQuantity,
      },
    });

    // Remove item from cart
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

  async updateCartItemQuantity(
    userId: number,
    productId: string,
    quantity: number,
  ) {
    const userIdInt = Number(userId);

    // Validate user ID and quantity
    if (isNaN(userIdInt) || isNaN(quantity) || quantity < 0) {
      throw new NotFoundException('Invalid user ID or quantity');
    }

    // Fetch product details
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Ensure quantity is treated as a number
    const requestedQuantity = Number(quantity);

    // Check if there's enough stock available for the requested change
    if (requestedQuantity > product.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    // Update cart item quantity directly with the requested quantity
    await this.prisma.cart.upsert({
      where: {
        userId_productId: {
          userId: userIdInt,
          productId,
        },
      },
      update: { quantity: requestedQuantity }, // Update to requested quantity
      create: { userId: userIdInt, productId, quantity: requestedQuantity }, // Create if not exists
    });

    // Update Product quantity after updating the cart
    await this.prisma.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - requestedQuantity },
    });

    // Log to quantity management
    await this.prisma.quantitymanagement.create({
      data: {
        currentquantity: product.quantity,
        afterupdatequantity: product.quantity - requestedQuantity,
      },
    });

    return { message: 'Item quantity updated successfully' };
  }

  async clearCart(userId: number) {
    const userIdInt = Number(userId);

    // Fetch cart items for the user
    const cartItems = await this.prisma.cart.findMany({
      where: { userId: userIdInt },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('No items found in the cart');
    }

    // Loop through each item in the cart
    for (const item of cartItems) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product not found for ID: ${item.productId}`,
        );
      }

      // Calculate new quantity for the product
      const newQuantity = product.quantity + item.quantity;

      // Update product quantity by adding back the quantity from the cart
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { quantity: newQuantity },
      });

      // Log to quantity management
      await this.prisma.quantitymanagement.create({
        data: {
          currentquantity: product.quantity,
          afterupdatequantity: newQuantity,
        },
      });
    }

    // Clear the cart for the user
    await this.prisma.cart.deleteMany({ where: { userId: userIdInt } });

    return { message: 'Cart cleared successfully' };
  }
}
