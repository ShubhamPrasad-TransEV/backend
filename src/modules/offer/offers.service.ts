import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferProductStockDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  private isOfferValid(offer: { validFrom: Date; validUntil: Date }): boolean {
    const now = new Date();
    return now >= offer.validFrom && now <= offer.validUntil;
  }

  async createOfferableProduct(createOfferDto: CreateOfferDto) {
    const {
      userId,
      type,
      discount,
      productData,
      validFrom,
      validUntil,
      description,
      buyQuantity,
      getQuantity,
    } = createOfferDto;

    if (!productData.quantity) {
      throw new BadRequestException(
        'Quantity is required to create offerable units',
      );
    }

    const offerableProduct = await this.productsService.createProduct(
      productData,
      productData.images,
    );

    const offer = await this.prisma.offer.create({
      data: {
        name: `Discounted Offer for ${productData.name}`,
        type,
        discount,
        buyQuantity,
        getQuantity,
        buyProductId: offerableProduct.product.id,
        validFrom,
        validUntil,
        description,
        sellerId: userId,
      },
    });

    return { offer, offerableProduct };
  }

  async updateOfferableProductStock(
    updateStockDto: UpdateOfferProductStockDto,
  ) {
    const { productId, quantity } = updateStockDto;

    const originalProduct = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, categories: true },
    });

    if (!originalProduct) {
      throw new NotFoundException(
        `Original product with ID ${productId} not found`,
      );
    }

    const newUnits = Array.from({ length: quantity }).map(() => ({
      productId,
    }));

    await this.prisma.unit.createMany({ data: newUnits });

    return {
      message: `Stock updated for offerable product ID ${productId} with ${quantity} new units.`,
    };
  }

  async getOfferById(offerId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: { buyProduct: true, getProduct: true },
    });

    if (!offer)
      throw new NotFoundException(`Offer with ID ${offerId} not found`);

    const buyProductStock = offer.buyProductId
      ? await this.prisma.unit.count({
          where: { productId: offer.buyProductId },
        })
      : null;
    const getProductStock = offer.getProductId
      ? await this.prisma.unit.count({
          where: { productId: offer.getProductId },
        })
      : null;

    return {
      ...offer,
      buyProductStock,
      getProductStock,
    };
  }

  async getOffersByProductId(productId: string) {
    const offers = await this.prisma.offer.findMany({
      where: { buyProductId: productId },
      include: { buyProduct: true, getProduct: true },
    });

    if (offers.length === 0)
      throw new NotFoundException(
        `No offers found for product ID ${productId}`,
      );

    return await Promise.all(
      offers.map(async (offer) => {
        const buyProductStock = await this.prisma.unit.count({
          where: { productId: offer.buyProductId },
        });
        const getProductStock = offer.getProductId
          ? await this.prisma.unit.count({
              where: { productId: offer.getProductId },
            })
          : null;

        return {
          ...offer,
          buyProductStock,
          getProductStock,
        };
      }),
    );
  }

  async getOffersBySellerId(sellerId: number) {
    const offers = await this.prisma.offer.findMany({
      where: { sellerId },
      include: { buyProduct: true, getProduct: true },
    });

    if (offers.length === 0)
      throw new NotFoundException(`No offers found for seller ID ${sellerId}`);

    return await Promise.all(
      offers.map(async (offer) => {
        const buyProductStock = await this.prisma.unit.count({
          where: { productId: offer.buyProductId },
        });
        const getProductStock = offer.getProductId
          ? await this.prisma.unit.count({
              where: { productId: offer.getProductId },
            })
          : null;

        return {
          ...offer,
          buyProductStock,
          getProductStock,
        };
      }),
    );
  }

  async validateAndApplyOffer(
    productId: string,
    offerId: string,
  ): Promise<string> {
    const offer = await this.getOfferById(offerId);

    if (!this.isOfferValid(offer))
      throw new BadRequestException('Offer is not currently valid');

    const availableStock = await this.prisma.unit.count({
      where: { productId: offer.buyProductId },
    });
    if (availableStock < (offer.buyQuantity || 1)) {
      throw new BadRequestException(`Insufficient stock for offer`);
    }

    return offer.buyProductId;
  }
}
