import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Buffer } from 'buffer'; // Ensure Buffer is imported

@Injectable()
export class UploadProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(data: {
        name: string;
        price: number;
        description: string;
        sellerId: number;
        images: Buffer[];
    }) {
        const { images, ...productData } = data;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                images: {
                    create: images.map((image) => ({
                        data: image, // Storing binary data directly
                    })),
                },
            },
        });
        return product;
    }
    
    async getProductById(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { images: true }, // Ensure that images are included
        });
    }
    
    async getImageById(id: number) {
        const image = await this.prisma.image.findUnique({
            where: { id },
        });
        if (!image) {
            throw new Error('Image not found');
        }
        return image.data; // Returning binary data
    }
}

