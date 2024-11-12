import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    type: 'object',
    properties: {
      key1: { type: 'string' }, // Example property
      key2: { type: 'number' }, // Example property
    },
    required: [], // Specify required fields if any, or leave empty for none
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  productDetails?: object;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({
    example: '+50',
    description:
      'Can be a positive or negative number as a string for incremental update (e.g., +50, -50) or a direct new value',
    required: false,
  })
  @IsOptional()
  @IsString()
  quantity?: string;
}
