import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path as necessary
import { CreateMostlySearchedDto } from './dto/popularanalytics.dto'; // Adjust the path as necessary

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
      throw new NotFoundException(`Mostly searched entry with ID ${id} not found`);
    }

    return entry;
  }
}
