import {
  BadRequestException,
  ForbiddenException,
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
        images: true, // Assuming you have an `images` relation in your Prisma schema
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
        images: true, // Assuming you have an `images` relation in your Prisma schema
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  private async validateUserRole(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required and must be valid.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new BadRequestException(`User with ID ${userId} does not exist`);
    }

    if (user.role.name !== 'Admin' && user.role.name !== 'Seller') {
      throw new ForbiddenException(
        `User with ID ${userId} is not authorized to upload products`,
      );
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageBuffers: { filename: string; data: Buffer }[],
  ) {
    const userId = parseInt(createProductDto.userId?.toString(), 10);

    if (isNaN(userId)) {
      throw new BadRequestException('User ID must be a valid number');
    }

    await this.validateUserRole(userId);

    const price = parseFloat(createProductDto.price?.toString());

    if (isNaN(price)) {
      throw new BadRequestException('Price must be a valid number');
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price,
        description: createProductDto.description,
        userId,
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
