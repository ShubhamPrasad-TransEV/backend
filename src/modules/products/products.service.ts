import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import stringSimilarity from 'string-similarity';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types'; // Import mime-types to get the MIME type based on file extension

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
    const { sellerId, name, price, categories, quantity } = createProductDto;

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

    const productDetails =
      typeof createProductDto.productDetails === 'string'
        ? JSON.parse(createProductDto.productDetails)
        : createProductDto.productDetails;

    const product = await this.prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        sellerId: parsedSellerId,
        productDetails: productDetails || {},
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

    const units = Array.from({ length: parsedQuantity }).map(() => ({
      productId: product.id,
    }));

    await this.prisma.unit.createMany({
      data: units,
    });

    const imagesWithBase64 = product.images.map((image) => {
      const imagePath = path.resolve(image.path);
      const mimeType = mime.lookup(imagePath) || 'image/jpeg';
      const base64Data = fs.existsSync(imagePath)
        ? fs.readFileSync(imagePath).toString('base64')
        : null;

      return {
        filename: image.filename,
        url: `${process.env.BASE_URL}/products/images/${image.filename}`,
        base64: base64Data ? `data:${mimeType};base64,${base64Data}` : null,
      };
    });

    return {
      product,
      // ...product,
      // images: imagesWithBase64,
    };
  }

  // Update a product with unit handling
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        categories: true,
        Unit: { select: { id: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { price, images, categories, productDetails, quantity, ...rest } =
      updateProductDto;

    let updatedQuantity = product.quantity;

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

    let categoryConnect = undefined;
    if (categories) {
      let parsedCategories = categories;

      if (typeof categories === 'string') {
        try {
          parsedCategories = JSON.parse(categories);
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

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        price,
        productDetails: productDetails ?? product.productDetails,
        quantity: updatedQuantity,
        images: images
          ? {
              create: images.map((file) => ({
                filename: file.filename,
                path: file.path,
              })),
            }
          : undefined,
        categories: categoryConnect,
      },
      include: {
        images: true,
        categories: true,
      },
    });

    const imagesWithBase64 = updatedProduct.images.map((image) => {
      const imagePath = path.resolve(image.path);
      const mimeType = mime.lookup(imagePath) || 'image/jpeg';
      const base64Data = fs.existsSync(imagePath)
        ? fs.readFileSync(imagePath).toString('base64')
        : null;

      return {
        filename: image.filename,
        url: `${process.env.BASE_URL}/products/images/${image.filename}`,
        base64: base64Data ? `data:${mimeType};base64,${base64Data}` : null,
      };
    });

    return {
      ...updatedProduct,
      images: imagesWithBase64,
    };
  }

  // Delete product and its units
  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        Unit: true,
        categories: true,
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
          })),
        },
      },
    });

    await this.prisma.unit.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getImagesByProductId(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product.images;
  }

  async searchProducts(
    term: string,
  ): Promise<{ id: string; name: string; similarity: number }[]> {
    if (!term || term.trim() === '') {
      throw new BadRequestException('Search term cannot be empty');
    }

    const searchTerm = term.toLowerCase();

    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const rankedProducts = products.map((product) => {
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

    rankedProducts.sort((a, b) => b.similarity - a.similarity);

    return rankedProducts.filter((product) => product.similarity > 0.2);
  }

  private partialOrFuzzyMatch(productName: string, searchTerm: string): number {
    const normalizedProductName = this.normalizeString(productName);
    const normalizedSearchTerm = this.normalizeString(searchTerm);

    const productNgrams = this.createNgrams(normalizedProductName, 2);
    const searchNgrams = this.createNgrams(normalizedSearchTerm, 2);

    const matchedNgrams = searchNgrams.filter((ngram) =>
      productNgrams.includes(ngram),
    );
    const matchRatio = matchedNgrams.length / searchNgrams.length;

    const matchLengthScore =
      matchedNgrams.join('').length / normalizedProductName.length;

    let similarityScore = 0.7 * matchRatio + 0.3 * matchLengthScore;

    if (similarityScore < 0.5) {
      similarityScore = stringSimilarity.compareTwoStrings(
        normalizedProductName,
        normalizedSearchTerm,
      );
    }

    return similarityScore;
  }

  private createNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.substring(i, i + n));
    }
    return ngrams;
  }

  private normalizeString(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  async getProductsBySellerId(sellerId: number) {
    const products = await this.prisma.product.findMany({
      where: { sellerId },
      include: {
        images: true,
        categories: true,
      },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(
        `No products found for seller with ID ${sellerId}`,
      );
    }

    return products;
  }

  async getVarieties(productId?: string, productName?: string) {
    let nameToSearch: string;

    if (productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      nameToSearch = product.name;
    }

    if (productName) {
      nameToSearch = productName;
    }

    const products = await this.prisma.product.findMany({
      where: { name: nameToSearch },
      select: {
        id: true,
        name: true,
        productDetails: true,
      },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(
        `No varieties found for product ${nameToSearch}`,
      );
    }

    const varieties = this.getDifferingFields(
      products.map((p) => p.productDetails),
    );

    return {
      varieties,
    };
  }

  private getDifferingFields(
    productDetailsArray: any[],
  ): Record<string, any[]> {
    if (productDetailsArray.length <= 1) {
      return {};
    }

    const allKeys = new Set<string>();

    productDetailsArray.forEach((details) => {
      Object.keys(details).forEach((key) => allKeys.add(key));
    });

    const differingFields: Record<string, any[]> = {};

    allKeys.forEach((key) => {
      const values = productDetailsArray.map((details) => details[key]);

      const isSame = values.every(
        (value) => JSON.stringify(value) === JSON.stringify(values[0]),
      );

      if (!isSame) {
        differingFields[key] = values;
      }
    });

    return differingFields;
  }
}
