import { Controller, Post, UploadedFiles, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as path from 'path';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Save files to the server
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls = await Promise.all(
      files.map(file => {
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/${file.originalname}`;
      }),
    );

    return this.productsService.createProduct(createProductDto, imageUrls);
  }
}
