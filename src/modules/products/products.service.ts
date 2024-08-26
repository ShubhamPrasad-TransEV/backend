import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUserRole(userId) {
    console.log(typeof userId)
    const uid= parseInt(userId)
    const user = await this.prisma.user.findUnique({
      where: { id:uid },
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
    // Convert userId to an integer
    const userId = parseInt(createProductDto.userId.toString());
  
    // Validate user role with the integer userId
    await this.validateUserRole(userId);
  
    // Create the product with the integer userId
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: parseFloat(createProductDto.price.toString()),
        description: createProductDto.description,
        userId: userId, // Pass the integer userId here
        images: {
          create: imageUrls.map(url => ({
            filename: url,
            data: Buffer.alloc(0), // Placeholder for file data if needed
          })),
        },
      },
    });
  }
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        images: true, // Include images if you want to fetch them
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        images: true, // Include images if you want to fetch them
      },
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...updateProductDto,
        price: updateProductDto.price ? parseFloat(updateProductDto.price.toString()) : undefined,
        images: updateProductDto.images ? {
            updateMany: {
              where: {
                productId: parseInt(id, 10),
              },
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