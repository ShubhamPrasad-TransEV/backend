import { Body, Controller, Get, Param, Post, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UploadProductService } from './upload-product.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadProductDto } from './dto/upload-prod.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
        type: UploadProductDto,
    })
    async createProduct(
        @Body() body: UploadProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        // Assuming you have logic to read and convert files to Buffer
        const images = files.map(file => fs.readFileSync(`./uploads/${file.filename}`));
        return this.productService.createProduct({
            ...body,
            images,
        });
    }

    @Get(':id')
    async getProduct(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Get('image/:id')
    async getImage(@Param('id') id: number, @Res() res: Response) {
        const imageData = await this.productService.getImageById(id);
        res.setHeader('Content-Type', 'image/jpeg');  // Adjust based on image type
        res.send(imageData);
    }
}
