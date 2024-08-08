import { Controller, Post, UseInterceptors, UploadedFiles, Res, HttpException, HttpStatus, Body, Param, Get, Logger } from '@nestjs/common';
import { UploadProductService } from './upload-product.service';
import { ApiBody, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadProductDto } from './dto/upload-prod.dto';
import * as fs from 'fs';

@ApiTags('Products')
@Controller('upload-product')
export class UploadProductController {
    constructor(private readonly productService: UploadProductService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = `${Date.now()}${extname(file.originalname)}`;
                cb(null, filename);
            },
        }),
    }))
    @ApiBody({
        description: 'Product creation payload with file upload',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Product Name' },
                price: { type: 'string', example: '100' },  // Changed to string for conversion
                description: { type: 'string', example: 'Product description' },
                sellerId: { type: 'number', example: 1 },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Product created successfully with images',
    })
    async createProduct(
        @Body() body: UploadProductDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res: Response
    ) {
        if (!files || files.length === 0) {
            throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
        }
        const imageBase64Strings = files.map(file => {
            const fileBuffer = fs.readFileSync(`./uploads/${file.filename}`);
            return fileBuffer.toString('base64');
        });
        const productData = {
            ...body,
            images: imageBase64Strings,
            sellerId: body.sellerId,
        };
        const createdProduct = await this.productService.createProduct(productData);
        res.status(HttpStatus.CREATED).json({
            message: 'Product created successfully',
            product: createdProduct,
        });
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Product not found..' })
    async getProduct(@Param('id') id: number) {
        Logger.log(`Get product by ID: ${id}`, 'UploadProductController');
        return this.productService.getProductById(id);
    }

}
