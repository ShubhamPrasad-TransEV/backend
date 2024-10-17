import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService for database interaction

@Module({
  controllers: [WishlistController],
  providers: [WishlistService, PrismaService], // Register both WishlistService and PrismaService
})
export class WishlistModule {}
