import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto, imageUrls: string[]) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: parseFloat(createProductDto.price.toString()), // Ensure price is a Float
        description: createProductDto.description,
        userId: parseInt(createProductDto.userId.toString(), 10), // Ensure userId is an Int
        images: {
          create: imageUrls.map(url => ({
            filename: url,
            data: Buffer.alloc(0), // You might not need this if not storing actual file data
          })),
        },
      },
    });
  }
}
