// src/register/dto/update-seller.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellerDto {
    @ApiProperty({
        description: 'The unique identifier of the seller',
        example: 123,
        type: Number,
    })
    id: number;

    @ApiProperty({
        description: 'The name of the seller’s store',
        example: 'Best Electronics',
        required: false,
        type: String,
    })
    storeName?: string;

    @ApiProperty({
        description: 'The address of the seller’s store',
        example: '123 Tech Street, Silicon Valley, CA',
        required: false,
        type: String,
    })
    storeAddress?: string;

    @ApiProperty({
        description: 'The email address of the seller’s store',
        example: 'contact@bestelectronics.com',
        required: false,
        type: String,
    })
    storeEmail?: string;

    @ApiProperty({
        description: 'The phone number of the seller’s store',
        example: '+1-800-555-1234',
        required: false,
        type: String,
    })
    storePhoneNumber?: string;

    @ApiProperty({
        description: 'A brief description about the seller’s store',
        example: 'We offer the latest in electronic gadgets and accessories.',
        required: false,
        type: String,
    })
    aboutUs?: string;

    @ApiProperty({
        description: 'The URL or file path to the seller’s store logo',
        example: 'https://example.com/logo.png',
        required: false,
        type: String,
    })
    logo?: string;
}
