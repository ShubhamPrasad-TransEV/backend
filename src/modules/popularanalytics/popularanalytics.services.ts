import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path as necessary
import { CreateMostlySearchedDto } from './dto/popularanalytics.dto'; // Adjust the path as necessary

@Injectable()
export class MostlySearchedService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to track product clicks
  async trackProductClick(productId: string) {
    // Check if the product entry already exists
    const existingEntry = await this.prisma.mostlySearched.findUnique({
      where: { productid: productId },
    });

    if (existingEntry) {
      // If it exists, increment the number of searches
      return this.prisma.mostlySearched.update({
        where: { id: existingEntry.id }, // Use the existing entry's ID
        data: {
          numberofsearch: existingEntry.numberofsearch + 1, // Increment count
        },
      });
    } else {
      // If it doesn't exist, create a new entry with number of searches set to 1
      return this.prisma.mostlySearched.create({
        data: {
          productid: productId,
          numberofsearch: 1, // Initial count
        },
      });
    }
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
        product: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Mostly searched entry with ID ${id} not found`);
    }

    return entry;
  }
}
