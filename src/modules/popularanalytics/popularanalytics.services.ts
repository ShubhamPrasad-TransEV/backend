import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path as necessary
import {
  CreateMostlySearchedDto,
  CreateMostlyViewedDto,
} from './dto/popularanalytics.dto'; // Adjust the path as necessary

@Injectable()
export class MostlySearchedService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a new Mostly Searched entry
  async createMostlySearched(data: CreateMostlySearchedDto) {
    // Check if productid is provided
    if (!data.productid) {
      throw new NotFoundException('Product ID must be provided');
    }

    // Create a new entry in the MostlySearched model
    return this.prisma.mostlySearched.create({
      data: {
        productid: data.productid,
        numberofsearch: data.numberofsearch || 1, // Default to 1 if not provided
      },
    });
  }

  // Method to get all Mostly Searched entries
  async getAllMostlySearched() {
    return this.prisma.mostlySearched.findMany({
      include: {
        product: true, // Include related product details if needed
      },
    });
  }

  // Method to get a specific Mostly Searched entry by ID
  async getMostlySearchedById(id: number) {
    const entry = await this.prisma.mostlySearched.findUnique({
      where: { id },
      include: {
        product: true, // Include related product details if needed
      },
    });

    if (!entry) {
      throw new NotFoundException(
        `Mostly searched entry with ID ${id} not found`,
      );
    }

    return entry;
  }
}

@Injectable()
export class MostlyViewedService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to update or create a Mostly Viewed entry
  async incrementMostlyViewed(data: CreateMostlyViewedDto) {
    // Check if productId is provided
    if (!data.productId) {
      throw new NotFoundException('Product ID must be provided');
    }

    // Increment the views count or create a new entry with initial views of 1
    return this.prisma.mostlyViewed.upsert({
      where: { productId: data.productId },
      update: {
        views: {
          increment: 1, // Increment views by 1
        },
      },
      create: {
        productId: data.productId,
        views: 1, // Initial views count if creating a new entry
      },
    });
  }

  // Method to get all Mostly Viewed entries
  async getAllMostlyViewed(limit?: number) {
    // Query the mostly viewed entries in descending order by views
    const entries = await this.prisma.mostlyViewed.findMany({
      orderBy: { views: 'desc' },
      include: {
        product: true,
      },
      take: limit || undefined, // Take 'limit' entries if provided; otherwise, return all
    });

    // If limit is greater than the number of entries, return all entries
    if (limit && entries.length < limit) {
      return entries;
    }

    return entries;
  }
}
