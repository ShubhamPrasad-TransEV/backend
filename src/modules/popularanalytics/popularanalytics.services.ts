import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMostlySearchedDto,
  CreateMostlyViewedDto,
} from './dto/popularanalytics.dto';

@Injectable()
export class MostlySearchedService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to track product clicks
  async trackProductClick(productId: string): Promise<MostlySearched> {
    const existingEntry = await this.prisma.mostlySearched.findUnique({
      where: { productid: productId },
    });

    if (existingEntry) {
      return this.prisma.mostlySearched.update({
        where: { id: existingEntry.id },
        data: {
          numberofsearch: existingEntry.numberofsearch + 1,
        },
      });
    } else {
      return this.prisma.mostlySearched.create({
        data: {
          productid: productId,
          numberofsearch: 1,
        },
      });
    }
  }

  // Method to get all Mostly Searched entries
  async getAllMostlySearched(): Promise<MostlySearched[]> {
    return this.prisma.mostlySearched.findMany({
      include: {
        product: true,
      },
    });
  }

  // Method to get a specific Mostly Searched entry by ID
  async getMostlySearchedById(id: number): Promise<MostlySearched> {
    const entry = await this.prisma.mostlySearched.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(
        `Mostly searched entry with ID ${id} not found`,
      );
    }

    return entry;
  }

  // Method to get popular categories and brands
  async getPopularCategoriesAndBrands(): Promise<{
    popularCategories: string[];
    popularBrands: string[];
  }> {
    const orders = await this.prisma.order.findMany({
      select: {
        orderedItems: true,
      },
    });

    console.log('Orders fetched:', orders);

    const productIds: string[] = [];

    for (const order of orders) {
      const itemsArray = order.orderedItems as Array<{
        productId: string;
        quantity: number;
      }>;

      // Log structure of each item
      console.log('orderedItems structure:', itemsArray);

      itemsArray.forEach((item) => {
        if (item.productId) {
          productIds.push(item.productId); // Extract and push productId
        }
      });
    }

    console.log('Extracted product IDs:', productIds);

    if (productIds.length === 0) {
      return { popularCategories: [], popularBrands: [] };
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        categories: true,
      },
    });

    console.log('Products fetched:', products);

    const categoryCount: Record<string, number> = {};
    const brandCount: Record<string, number> = {};

    products.forEach((product) => {
      // Count categories
      product.categories.forEach((category) => {
        const categoryId = category.id.toString();
        categoryCount[categoryId] = (categoryCount[categoryId] ?? 0) + 1;
      });

      // Parse productDetails to access brand
      const details = product.productDetails as Record<string, any>;
      const brand = details?.brand;

      if (brand) {
        brandCount[brand] = (brandCount[brand] ?? 0) + 1;
      }
    });

    const popularCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);

    const popularBrands = Object.entries(brandCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([brand]) => brand);

    return { popularCategories, popularBrands };
  }
}

@Injectable()
export class MostlyViewedService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to update or create a Mostly Viewed entry
  async incrementMostlyViewed(
    data: CreateMostlyViewedDto,
  ): Promise<MostlyViewed> {
    if (!data.productId) {
      throw new NotFoundException('Product ID must be provided');
    }

    return this.prisma.mostlyViewed.upsert({
      where: { productId: data.productId },
      update: {
        views: {
          increment: 1,
        },
      },
      create: {
        productId: data.productId,
        views: 1,
      },
    });
  }

  // Method to get all Mostly Viewed entries
  async getAllMostlyViewed(limit?: number): Promise<MostlyViewed[]> {
    const entries = await this.prisma.mostlyViewed.findMany({
      orderBy: { views: 'desc' },
      include: {
        product: true,
      },
      take: limit || undefined,
    });

    if (limit && entries.length < limit) {
      return entries;
    }

    return entries;
  }
}

// Interfaces defined within the same file
interface OrderedItem {
  productId?: string; // Assuming productId is a string
}

export interface MostlySearched {
  id?: number; // Optional ID for mostly searched entry
  productid?: string; // Product ID
  numberofsearch?: number; // Number of searches
}

export interface MostlyViewed {
  id?: number; // Optional ID for mostly viewed entry
  productId?: string; // Product ID
  views?: number; // Number of views
}

interface Product {
  id?: string; // Assuming product ID is a string
  categories?: Array<{ id?: number; name?: string }>; // Assuming categories are represented by an array of objects with id as number
  sellerId?: string; // Assuming seller ID is a string
}
