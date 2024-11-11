import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offer.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [],
  controllers: [OffersController],
  providers: [OffersService, PrismaService, ProductsService],
})
export class OfferModule {}
