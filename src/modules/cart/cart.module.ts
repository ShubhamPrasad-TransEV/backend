import { Module } from '@nestjs/common';
import { CartService } from './cart.service'; // Adjust the path as necessary
import { CartController } from './cart.controller'; // If you have a controller for handling requests
import { PrismaService } from '../../prisma/prisma.service'; // Import Prisma service if needed

@Module({
  imports: [], // Add any other modules if required
  controllers: [CartController], // Register the CartController if you have one
  providers: [CartService, PrismaService], // Register your CartService and any other services
  exports: [CartService], // Export CartService if it needs to be used in other modules
})
export class CartModule {}
