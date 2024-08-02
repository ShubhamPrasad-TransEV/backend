import { IsArray, IsNumber, IsString } from "class-validator";

export class UploadProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;

    @IsNumber()
    sellerId: number;

    @IsArray()
    @IsString({ each: true }) // Validate each item in the array as a string
    images: string[]; // Images as base64-encoded strings
}
