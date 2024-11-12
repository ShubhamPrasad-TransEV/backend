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
  @IsString()
  @IsNotEmpty()
  description: string;

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

  // Update here with properties defined
  @ApiProperty({
    type: 'object',
    properties: {
      // Define properties of productDetails here
      key1: { type: 'string' }, // Example property
      key2: { type: 'number' }, // Example property
    },
    nullable: true,
  })
  @IsOptional()
  @IsJSON()
  productDetails?: object;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
