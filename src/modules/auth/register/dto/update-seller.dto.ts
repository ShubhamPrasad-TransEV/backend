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
