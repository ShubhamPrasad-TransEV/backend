import { IsNotEmpty, IsNumber, IsOptional, IsString,IsArray } from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  // Optional: If you need to handle image files as part of the DTO, use the following:
  // Make sure to handle file uploads separately
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  imageFiles?: Express.Multer.File[];
}
