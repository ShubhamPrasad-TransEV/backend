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
    return this.prisma.product.findMany({
      include: {
        images: true, // Include images relation
      },
    });
  }

  async findOne(id: string) {
    // The product ID is a UUID (string)
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true, // Include images relation to ensure TypeScript knows about it
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Map the image paths to create URLs for each image
    const imageUrls = product.images.map((image) => ({
      filename: image.filename,
      url: `${process.env.BASE_URL}/products/images/${image.filename}`,
    }));

    return {
      ...product,
      images: imageUrls,
    };
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imagePaths: { filename: string; path: string }[],
  ) {
    const { sellerId, name, price } = createProductDto;

    // Convert sellerId to a number and validate
    const parsedSellerId = Number(sellerId);
    if (isNaN(parsedSellerId)) {
      throw new BadRequestException('Seller ID must be a valid number');
    }

    // Convert price to a number (float) and validate
    const parsedPrice = parseFloat(price.toString());
    if (isNaN(parsedPrice)) {
      throw new BadRequestException('Price must be a valid number');
    }

    return this.prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        sellerId: parsedSellerId,
        images: {
          create: imagePaths.map((file) => ({
            filename: file.filename,
            path: file.path,
          })),
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // The product ID is a UUID (string)
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true, // Ensure images are included in the product
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { price, images, ...rest } = updateProductDto;

    // Handle image updates (delete and recreate for simplicity)
    if (images) {
      await this.prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        price,
        images: images
          ? {
              create: images.map((file) => ({
                filename: file.filename,
                path: file.path,
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    // The product ID is a UUID (string)
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
