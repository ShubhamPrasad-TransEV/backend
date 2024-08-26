import { Controller, Post, Get , Param , Query , UploadedFiles, UseInterceptors, Body, BadRequestException, NotFoundException, Patch, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(id, updateProductDto);
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const result = await this.productsService.remove(id);
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} has been deleted` };
  }
}

