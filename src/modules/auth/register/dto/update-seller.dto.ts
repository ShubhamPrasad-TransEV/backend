// src/register/dto/update-seller.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellerDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ required: false })
    storeName?: string;

    @ApiProperty({ required: false })
    storeAddress?: string;

    @ApiProperty({ required: false })
    storeEmail?: string;

    @ApiProperty({ required: false })
    storePhoneNumber?: string;

    @ApiProperty({ required: false })
    aboutUs?: string;

    @ApiProperty({ required: false })
    logo?: string; // Assuming this is a URL or file path
}
