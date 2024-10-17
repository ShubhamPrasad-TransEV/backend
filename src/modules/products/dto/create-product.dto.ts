// create-product.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
  IsJSON,
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

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @ValidateIf((o) => typeof o.categories === 'string')
  @IsString()
  @ValidateIf((o) => Array.isArray(o.categories))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[] | string;

  @ApiProperty({ type: 'object', required: false }) // Swagger documentation
  @IsOptional()
  @IsJSON()
  productDetails?: object; // Optional field for product details
}
