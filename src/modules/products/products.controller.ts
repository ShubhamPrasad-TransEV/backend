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
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerConfig } from './multer.config'; // Import the multer configuration
import { Response } from 'express';
import { join } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig)) // Apply Multer configuration
  async uploadProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Map the files to store their paths instead of raw data
    const imagePaths = files.map((file) => ({
      filename: file.filename,
      path: file.path, // Save file path instead of binary data
    }));

    return await this.productsService.createProduct(createProductDto, imagePaths);
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
    return res.sendFile(imagePath); // Serve the image file from the uploads folder
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
      throw new BadRequestException(`Failed to delete product with ID ${id}`);
    }
  }
}
