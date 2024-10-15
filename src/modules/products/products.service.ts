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
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      throw new BadRequestException('Product ID must be a valid number');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true, // Include images relation
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Map the image paths to create a URL for each image
    const imageUrls = product.images.map((image) => ({
      filename: image.filename,
      url: `${process.env.BASE_URL}/products/images/${image.filename}`, // Generate the image URL
    }));

    return {
      ...product,
      images: imageUrls, // Return the product data along with image URLs
    };
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imagePaths: { filename: string; path: string }[],
  ) {
    const sellerId = parseInt(createProductDto.sellerId?.toString(), 10);
    if (isNaN(sellerId)) {
      throw new BadRequestException('Seller ID must be a valid number');
    }

    const price = parseFloat(createProductDto.price?.toString());
    if (isNaN(price)) {
      throw new BadRequestException('Price must be a valid number');
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price,
        sellerId,
        images: {
          create: imagePaths.map((file) => ({
            filename: file.filename,
            path: file.path, // Store the file path on the filesystem
          })),
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Product ID must be a valid number');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const price = updateProductDto.price
      ? parseFloat(updateProductDto.price.toString())
      : undefined;

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...updateProductDto,
        price,
        images: updateProductDto.images
          ? {
              create: updateProductDto.images.map((file) => ({
                filename: file.filename,
                path: file.path, // Update image path instead of binary data
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Product ID must be a valid number');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.image.deleteMany({
      where: { productId },
    });

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
