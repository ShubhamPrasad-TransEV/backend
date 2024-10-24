// products.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Body,
  Query,
  BadRequestException,
  Res,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetVarietiesDto } from './dto/products.varieties.dto';
import { multerConfig } from './multer.config';
import { Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async uploadProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const imagePaths = files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    return await this.productsService.createProduct(
      createProductDto,
      imagePaths,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      return product;
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve product with ID ${id}`);
    }
  }

  @Get('images/:imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'uploads', imageName);
    return res.sendFile(imagePath);
  }

  @Get('images/product/:productId')
  async getImagesByProductId(@Param('productId') productId: string) {
    try {
      const images = await this.productsService.getImagesByProductId(productId);

      if (!images || images.length === 0) {
        throw new NotFoundException(
          `No images found for product with ID ${productId}`,
        );
      }

      const base64Images = images.map((image) => {
        // Read the image file
        const imagePath = join(process.cwd(), image.path);
        const imageBuffer = readFileSync(imagePath);

        // Convert the image buffer to base64
        const base64 = imageBuffer.toString('base64');

        // Return the base64-encoded image along with the filename
        return {
          filename: image.filename,
          base64: `data:image/${image.filename.split('.').pop()};base64,${base64}`,
        };
      });

      return base64Images;
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve images for product ID ${productId}: ${error.message}`,
      );
    }
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update product with ID ${id}`);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productsService.remove(id);
      return { message: `Product with ID ${id} has been deleted` };
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete product with ID ${id} \n Error: ${error}`,
      );
    }
  }

  @Get('search/name')
  async searchProducts(@Query('term') term: string) {
    if (!term || term.trim() === '') {
      throw new BadRequestException('Search term cannot be empty');
    }
    return this.productsService.searchProducts(term);
  }

  @Get('seller/:sellerId')
  async getProductsBySellerId(
    @Param('sellerId', ParseIntPipe) sellerId: number,
  ) {
    const products = await this.productsService.getProductsBySellerId(sellerId);

    if (!products || products.length === 0) {
      throw new NotFoundException(
        `No products found for seller with ID ${sellerId}`,
      );
    }

    return products;
  }

  @Post('varieties')
  async getVarieties(@Body() getVarietiesDto: GetVarietiesDto) {
    const { productId, productName } = getVarietiesDto;

    if (!productId && !productName) {
      throw new BadRequestException(
        'Either productId or productName must be provided',
      );
    }

    return this.productsService.getVarieties(productId, productName);
  }
}
