import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsJSON,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  @IsJSON()
  productDetails?: object; // Optional field for product details

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  images?: Express.Multer.File[];
}
