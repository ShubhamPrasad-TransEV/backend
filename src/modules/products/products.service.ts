import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

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
      throw new ForbiddenException(`User with ID ${userId} is not authorized to upload products`);
    }
  }

  async createProduct(createProductDto: CreateProductDto, imageUrls: string[]) {
    const userId = parseInt(createProductDto.userId?.toString());

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
          create: imageUrls.map(url => ({
            filename: url,
            data: Buffer.alloc(0),
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

    const price = updateProductDto.price ? parseFloat(updateProductDto.price.toString()) : undefined;

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...updateProductDto,
        price,
        images: updateProductDto.images ? {
            updateMany: {
              where: { productId },
              data: updateProductDto.images.map((url) => ({
                filename: url,
                data: Buffer.alloc(0),
              })),
            },
          } : undefined,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.image.deleteMany({
      where: { id: parseInt(id, 10) },
    });

    return this.prisma.product.delete({
        where: {id: parseInt(id, 10)}
    })

  }
}