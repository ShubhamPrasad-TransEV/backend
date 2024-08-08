import { IsArray, IsNumber, IsString } from "class-validator";

export class UploadProductDto {
    @IsString()
    name: string;

    @IsString()
    price: string;  

    @IsString()
    description: string;

    @IsNumber()
    sellerId: number;

    @IsArray()
    @IsString({ each: true }) 
    images: string[]; 
}
