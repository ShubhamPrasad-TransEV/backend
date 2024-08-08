import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(data: {
        name: string;
        price: string;
        description: string;
        sellerId: number;
        images: string[];
    }) {  /* If any sellerId is not found, it will NOT throw an error. It has to be checked real sooon.... */
        const { images, sellerId, ...productData } = data;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                seller: {
                    connect: {
                        id: parseInt(sellerId.toString(), 10) 
                    }
                },
                images: {
                    create: images.map((filename) => ({
                        data: Buffer.from(filename, 'base64'), 
                    })),
                },
                price: parseFloat(data.price),
            },
        });
        return product;
    }

    async getProductById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id : parseInt(id.toString() , 10) },
            include: { images: true },
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }
}
