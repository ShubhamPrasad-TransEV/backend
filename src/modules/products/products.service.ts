import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
    imageBuffers: { filename: string; data: Buffer }[],
  ) {
    const { sellerId, mainCategory, subCategory, nestedSubCategory, images } =
      createProductDto;

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${sellerId} not found`);
    }

    // Ensure user is a seller
    if (user.roleId !== 3) {
      throw new BadRequestException(`User with ID ${sellerId} is not a seller`);
    }

    // Create the product with images
    const product = await this.prisma.product.create({
      data: {
        mainCategory,
        subCategory,
        nestedSubCategory,
        sellerId, // Ensure this is of type 'number'
        images: {
          create: imageBuffers.map((buffer) => ({
            filename: buffer.filename,
            data: buffer.data,
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
              updateMany: {
                where: { productId },
                data: updateProductDto.images.map((url) => ({
                  filename: url,
                  data: Buffer.alloc(0), // Placeholder for image data; adjust as needed
                })),
              },
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
