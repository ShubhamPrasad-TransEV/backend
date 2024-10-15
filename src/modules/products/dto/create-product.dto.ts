// create-product.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  // Optional: If you need to handle image files as part of the DTO, use the following:
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  imageFiles?: Express.Multer.File[];
}
