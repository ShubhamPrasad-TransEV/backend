import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

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
        productDetails: product.productDetails, // Return productDetails as JSON
      };
    });
  }

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
      productDetails: product.productDetails, // Return productDetails as JSON
    };
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imagePaths: { filename: string; path: string }[],
  ) {
    const { sellerId, name, price, categories, productDetails } =
      createProductDto;

    const parsedSellerId = Number(sellerId);
    if (isNaN(parsedSellerId)) {
      throw new BadRequestException('Seller ID must be a valid number');
    }

    const parsedPrice = parseFloat(price.toString());
    if (isNaN(parsedPrice)) {
      throw new BadRequestException('Price must be a valid number');
    }

    // Handle categories as either a string or an array
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

    // Fetch categories based on names
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

    return this.prisma.product.create({
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
      },
      include: {
        images: true,
        categories: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
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

    const { price, images, categories, productDetails, ...rest } =
      updateProductDto;

    // Handle category updates
    let parsedCategories = categories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
        if (!Array.isArray(parsedCategories)) {
          throw new Error();
        }
      } catch (error) {
        throw new BadRequestException('Categories must be a valid JSON array');
      }
    }

    let categoryConnect = undefined;
    if (Array.isArray(parsedCategories)) {
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
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.image.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
