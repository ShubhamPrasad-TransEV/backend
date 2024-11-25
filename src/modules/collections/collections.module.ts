// collections.module.ts
import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CollectionsController],
  providers: [CollectionsService, PrismaService],
})
export class CollectionsModule {}
