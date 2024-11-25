// top-rated.module.ts
import { Module } from '@nestjs/common';
import { TopRatedService } from './top-rated.service';
import { TopRatedController } from './top-rated.controller';
import { PrismaService } from 'src/prisma/prisma.service'; // Ensure this path is correct

@Module({
  controllers: [TopRatedController],
  providers: [TopRatedService, PrismaService],
})
export class TopRatedModule {}
