import { Module } from '@nestjs/common';
import { UploadProductController } from './upload-product.controller';
import { UploadProductService } from './upload-product.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadProductController],
  providers: [UploadProductService]
})
export class UploadProductModule {}
