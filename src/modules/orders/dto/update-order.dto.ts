import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: {
      "product-uuid-1": 2,
      "product-uuid-2": 1
    },
    description: 'Updated products and their quantities in the order',
    required: false,
  })
  @IsOptional()
  @IsObject()
  orderedItems?: Record<string, number>;

  @ApiProperty({
    example: 'DHL',
    description: 'Updated shipment company',
    required: false,
  })
  @IsOptional()
  @IsString()
  shipmentCompany?: string;

  @ApiProperty({
    example: 'Shipped',
    description: 'Updated shipment status',
    required: false,
  })
  @IsOptional()
  @IsString()
  shipmentStatus?: string;

  @ApiProperty({
    example: 'Fulfilled',
    description: 'Updated order fulfillment status',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderFulfillmentStatus?: string;

  @ApiProperty({
    example: 'Refunded',
    description: 'Updated refund status',
    required: false,
  })
  @IsOptional()
  @IsString()
  refundStatus?: string;

  @ApiProperty({
    example: 'Refund processed on 2024-10-10.',
    description: 'Updated refund details',
    required: false,
  })
  @IsOptional()
  @IsString()
  refundDetails?: string;

  @ApiProperty({
    example: 'Completed',
    description: 'Updated order status',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderingStatus?: string;

  @ApiProperty({
    example: true,
    description: 'Updated payment status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  paymentStatus?: boolean;

  @ApiProperty({
    example: 5.0,
    description: 'Updated shipping cost for the order',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shippingCost?: number;
}
