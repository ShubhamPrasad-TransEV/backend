import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { OfferType } from '@prisma/client';

export class CreateOfferDto {
  @ApiProperty({ description: 'ID of the user creating the offer', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Type of the offer', enum: OfferType })
  @IsEnum(OfferType)
  type: OfferType;

  @ApiProperty({
    description: 'Quantity to buy to activate the offer',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  buyQuantity?: number;

  @ApiProperty({
    description: 'Quantity to get as part of the offer',
    example: 7,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  getQuantity?: number;

  @ApiProperty({
    description: 'Discount percentage for discounted offers',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description:
      'Product details for creating a new product to link with this offer',
    type: CreateProductDto,
  })
  @ValidateNested()
  @Type(() => CreateProductDto)
  productData: CreateProductDto;

  @ApiProperty({
    description: 'Offer start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  validFrom: Date;

  @ApiProperty({
    description: 'Offer end date',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDate()
  @Type(() => Date)
  validUntil: Date;

  @ApiProperty({
    description: 'Description of the offer',
    example: 'Buy 1 get 7 free on select products',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
