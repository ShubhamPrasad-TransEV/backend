// top-rated.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the path as needed
import { CreateTopRatedDto } from './dto/create-top-rated.dto';
import { TopRated } from '@prisma/client';

@Injectable()
export class TopRatedService {
  constructor(private prisma: PrismaService) {}

  async create(createTopRatedDto: CreateTopRatedDto): Promise<TopRated> {
    return this.prisma.topRated.create({
      data: {
        productId: createTopRatedDto.productId,
        userId: createTopRatedDto.userId,
      },
    });
  }

  async findAll(): Promise<TopRated[]> {
    return this.prisma.topRated.findMany({
      include: { product: true }, // Include product details if needed
    });
  }
}
