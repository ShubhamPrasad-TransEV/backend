import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        ...data,
        logo: data.logo || null,
      },
    });
  }

  async update(id: number, data: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id },
      data: {
        ...data,
        logo: data.logo || null,
      },
    });
  }
}
