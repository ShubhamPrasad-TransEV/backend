<<<<<<< HEAD
// import {  Controller,Post,  Get,  Delete, Patch, Body,  Param, } from '@nestjs/common';
// import { CartService } from './cart.service';
// import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary 
=======
// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   Patch,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { CartService } from './cart.service';
// import { AddToCart } from './dto/cart.dto'; // Adjust the path as necessary
>>>>>>> b37ada0d96deb886a39fbe2af7f215e812c7c13a

// @Controller('cart')
// export class CartController {
//   constructor(private readonly cartService: CartService) {}

<<<<<<< HEAD

=======
>>>>>>> b37ada0d96deb886a39fbe2af7f215e812c7c13a
//   @Post('add/product/') // Updated route
//   async addToCart(
//     @Body() body: { userId: number; productId: string; quantity?: number }, // Fetching userId, productId, and quantity from body
//   ) {
<<<<<<< HEAD
//     const { userId, productId } = body; // Destructuring userId and productId from body 
//     const quantity = Number(body.quantity) || 1; // Default to 1 if quantity is not provided 
=======
//     const { userId, productId } = body; // Destructuring userId and productId from body
//     const quantity = Number(body.quantity) || 1; // Default to 1 if quantity is not provided
>>>>>>> b37ada0d96deb886a39fbe2af7f215e812c7c13a

//     const addToCartDto: AddToCart = { userId, productId };
//     return this.cartService.addToCart(addToCartDto, quantity);
//   }

//   //get cart items using userid
//   @Get('/getcartitems') // Updated route to remove userId from params
//   async getCartItems(@Body() body: { userId: number }) {
//     const { userId } = body; // Extract userId from the request body
//     return this.cartService.getCartItems(userId);
//   }

//   //remove from cart route
//   @Delete('/removefromcart') // Updated route
//   async removeFromCart(@Body() body: { userId: number; productId: string }) {
//     const { userId, productId } = body;
//     return this.cartService.removeFromCart(userId, productId);
//   }
<<<<<<< HEAD
  
//   //update route
//   @Patch('/updatecart') // Updated route
//   async updateCartItemQuantity(
//     @Body() body: { userId: number; productId: string; quantity: number }, // Fetching quantity from body 
=======

//   //update route
//   @Patch('/updatecart') // Updated route
//   async updateCartItemQuantity(
//     @Body() body: { userId: number; productId: string; quantity: number }, // Fetching quantity from body
>>>>>>> b37ada0d96deb886a39fbe2af7f215e812c7c13a
//   ) {
//     const { userId, productId, quantity } = body; // Destructure quantity from body
//     return this.cartService.updateCartItemQuantity(userId, productId, quantity);
//   }

<<<<<<< HEAD
//   //remove from cart //
=======
//   //remove from cart
>>>>>>> b37ada0d96deb886a39fbe2af7f215e812c7c13a
//   @Delete('/removeproductcart') // Updated route
//   async clearCart(
//     // @Param('userId') userId: number
//     @Body() body: { userId: number },
//   ) {
//     const { userId } = body;
//     return this.cartService.clearCart(userId);
//   }
// }

import { Controller, Get, Query, Post, Body, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCart } from './dto/cart.dto'; // Adjust path as necessary

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/product/')
  async addToCart(
    @Body() body: { userId: number; productId: string; quantity?: number },
  ) {
    const { userId, productId } = body;
    const quantity = Number(body.quantity) || 1; // Default to 1 if not provided
    const addToCartDto: AddToCart = { userId, productId };
    return this.cartService.addToCart(addToCartDto, quantity);
  }

  // Fetch cart items using GET with query parameter 'userId'
  @Get('/getcartitems')
  async getCartItems(@Query('userId') userId: number) {
    if (!userId) {
      throw new Error('UserId is required');
    }
    return this.cartService.getCartItems(userId); // Call service to fetch cart items for user
  }

  @Delete('/removefromcart')
  async removeFromCart(@Body() body: { userId: number; productId: string }) {
    const { userId, productId } = body;
    return this.cartService.removeFromCart(userId, productId);
  }

  @Patch('/updatecart')
  async updateCartItemQuantity(
    @Body() body: { userId: number; productId: string; quantity: number },
  ) {
    const { userId, productId, quantity } = body;
    return this.cartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @Delete('/clearcart')
  async clearCart(@Body() body: { userId: number }) {
    const { userId } = body;
    return this.cartService.clearCart(userId);
  }
}

