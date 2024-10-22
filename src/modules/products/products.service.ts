import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { stringSimilarity } from 'string-similarity';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch all products
  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        images: true,
        categories: true,
      },
    });

    return products.map((product) => {
      const imageUrls = product.images
        ? product.images.map((image) => ({
            filename: image.filename,
            url: `${process.env.BASE_URL}/products/images/${image.filename}`,
          }))
        : [];

      const categoryNames = product.categories
        ? product.categories.map((category) => category.name)
        : [];

      return {
        ...product,
        images: imageUrls,
        categories: categoryNames,
        productDetails: product.productDetails,
      };
    });
  }

  // Fetch one product by ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const imageUrls = product.images
      ? product.images.map((image) => ({
          filename: image.filename,
          url: `${process.env.BASE_URL}/products/images/${image.filename}`,
        }))
      : [];

    const categoryNames = product.categories
      ? product.categories.map((category) => category.name)
      : [];

    return {
      ...product,
      images: imageUrls,
      categories: categoryNames,
      productDetails: product.productDetails,
    };
  }

  // Create a product with units
  async createProduct(
    createProductDto: CreateProductDto,
    imagePaths: { filename: string; path: string }[],
  ) {
    const { sellerId, name, price, categories, productDetails, quantity } =
      createProductDto;

    const parsedSellerId = Number(sellerId);
    if (isNaN(parsedSellerId)) {
      throw new BadRequestException('Seller ID must be a valid number');
    }

    const parsedPrice = parseFloat(price.toString());
    if (isNaN(parsedPrice)) {
      throw new BadRequestException('Price must be a valid number');
    }

    const parsedQuantity = parseInt(quantity.toString(), 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw new BadRequestException('Quantity must be a valid positive number');
    }

    // If categories is a string, parse it into an array
    let parsedCategories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
        if (!Array.isArray(parsedCategories)) {
          throw new Error();
        }
      } catch (error) {
        throw new BadRequestException('Categories must be a valid JSON array');
      }
    } else if (Array.isArray(categories)) {
      parsedCategories = categories;
    } else {
      throw new BadRequestException('Categories must be a non-empty array');
    }

    if (parsedCategories.length === 0) {
      throw new BadRequestException('Categories must be a non-empty array');
    }

    // Fetch categories based on names to get their IDs
    const categoryRecords = await this.prisma.category.findMany({
      where: {
        name: {
          in: parsedCategories,
        },
      },
    });

    if (categoryRecords.length !== parsedCategories.length) {
      throw new BadRequestException('Some categories provided are invalid.');
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        sellerId: parsedSellerId,
        productDetails: productDetails || {}, // Save productDetails as JSON
        images: {
          create: imagePaths.map((file) => ({
            filename: file.filename,
            path: file.path,
          })),
        },
        categories: {
          connect: categoryRecords.map((category) => ({
            id: category.id,
          })),
        },
        quantity: parsedQuantity,
      },
      include: {
        images: true,
        categories: true,
      },
    });

    // Create units for the product
    const units = Array.from({ length: parsedQuantity }).map(() => ({
      productId: product.id,
    }));

    await this.prisma.unit.createMany({
      data: units,
    });

    return product;
  }

  // Update a product with unit handling
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        categories: true,
        Unit: { select: { id: true } },
      }, // Include units and select id
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { price, images, categories, productDetails, quantity, ...rest } =
      updateProductDto;

    let updatedQuantity = product.quantity;

    // Handle the quantity update
    if (quantity) {
      if (typeof quantity === 'string') {
        if (quantity.startsWith('+')) {
          updatedQuantity += parseInt(quantity.slice(1), 10);
        } else if (quantity.startsWith('-')) {
          updatedQuantity -= parseInt(quantity.slice(1), 10);
        } else {
          updatedQuantity = parseInt(quantity, 10);
        }

        if (updatedQuantity < 0) {
          throw new BadRequestException(
            'Resulting quantity cannot be negative',
          );
        }

        const currentUnitsCount = product.Unit.length;
        if (updatedQuantity > currentUnitsCount) {
          const newUnits = Array.from({
            length: updatedQuantity - currentUnitsCount,
          }).map(() => ({
            productId: product.id,
          }));
          await this.prisma.unit.createMany({ data: newUnits });
        } else if (updatedQuantity < currentUnitsCount) {
          const unitsToRemove = product.Unit.slice(
            0,
            currentUnitsCount - updatedQuantity,
          ).map((unit) => unit.id);
          await this.prisma.unit.deleteMany({
            where: { id: { in: unitsToRemove } },
          });
        }
      }
    }

    // Handle category updates
    let categoryConnect = undefined;
    if (categories) {
      let parsedCategories = categories; // Create a mutable variable

      if (typeof categories === 'string') {
        try {
          parsedCategories = JSON.parse(categories); // Parse into an array
          if (!Array.isArray(parsedCategories)) {
            throw new Error();
          }
        } catch (error) {
          throw new BadRequestException(
            'Categories must be a valid JSON array',
          );
        }
      }

      const categoryRecords = await this.prisma.category.findMany({
        where: {
          name: { in: parsedCategories },
        },
      });

      if (categoryRecords.length !== parsedCategories.length) {
        throw new BadRequestException('Some categories provided are invalid.');
      }

      categoryConnect = {
        set: categoryRecords.map((category) => ({
          id: category.id,
        })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        price,
        productDetails: productDetails ?? product.productDetails, // Update or keep existing productDetails
        quantity: updatedQuantity,
        images: images
          ? {
              create: images.map((file) => ({
                filename: file.filename,
                path: file.path,
              })),
            }
          : undefined,
        categories: categoryConnect, // Set updated categories if provided
      },
      include: {
        images: true,
        categories: true,
      },
    });
  }

  // Delete product and its units
  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        Unit: true,
        categories: true, // Ensure we include units to be deleted
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.prisma.product.update({
      where: { id },
      data: {
        categories: {
          disconnect: product.categories.map((category) => ({
            id: category.id,
          })), // Disconnect categories
        },
      },
    });

    // Delete associated units first
    await this.prisma.unit.deleteMany({
      where: { productId: id },
    });

    // Finally, delete the product
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async searchProducts(
    term: string,
  ): Promise<{ id: string; name: string; similarity: number }[]> {
    if (!term || term.trim() === '') {
      throw new BadRequestException('Search term cannot be empty');
    }

    const searchTerm = term.toLowerCase();

    // Fetch products with only the name field
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Filter and rank products by partial or fuzzy match on product name
    const rankedProducts = products.map((product) => {
      // Compute the similarity score between the product name and the search term
      const similarity = this.partialOrFuzzyMatch(
        product.name.toLowerCase(),
        searchTerm,
      );

      return {
        id: product.id,
        name: product.name,
        similarity,
      };
    });

    // Sort products by their similarity score in descending order
    rankedProducts.sort((a, b) => b.similarity - a.similarity);

    // Return products with a similarity score above a certain threshold
    return rankedProducts.filter((product) => product.similarity > 0.3);
  }

  // Helper function to perform partial or fuzzy matching on product names
  private partialOrFuzzyMatch(productName: string, searchTerm: string): number {
    // Return high similarity for partial matches (substring match)
    if (productName.includes(searchTerm)) {
      return 1; // Treat this as a perfect match
    }

    // If no direct substring match, fall back to fuzzy matching
    return stringSimilarity.compareTwoStrings(productName, searchTerm);
  }

  async getProductsBySellerId(sellerId: number) {
    // Find all products associated with the given sellerId
    const products = await this.prisma.product.findMany({
      where: { sellerId }, // Filtering by sellerId
      include: {
        images: true, // Include related images if you want
        categories: true, // Include related categories if you want
      },
    });

    // If no products are found, throw an exception
    if (!products || products.length === 0) {
      throw new NotFoundException(
        `No products found for seller with ID ${sellerId}`,
      );
    }

    return products; // Return the found products
  }
}
