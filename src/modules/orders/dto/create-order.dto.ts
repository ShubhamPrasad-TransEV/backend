import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderedItemDto {
  @ApiProperty({
    example: 'product-uuid-1',
    description: 'The ID of the product being ordered',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product being ordered',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: ['unit-uuid-1', 'unit-uuid-2'],
    description: 'The assigned unit IDs for the product',
  })
  @IsArray()
  @IsString({ each: true })
  assignedUnits: string[];

  @ApiProperty({
    example: 20.5,
    description: 'The price of the product after discount (if any)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceAfterDiscount?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'User ID of the person placing the order',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description:
      'List of ordered items including productId, quantity, assignedUnits, and priceAfterDiscount',
    type: [OrderedItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => OrderedItemDto)
  orderedItems: OrderedItemDto[];

  @ApiProperty({
    example: 'FedEx',
    description: 'Shipment company handling the order',
    required: false,
  })
  @IsOptional()
  @IsString()
  shipmentCompany?: string;

  @ApiProperty({
    example: 'Pending',
    description: 'Current shipment request status',
    required: false,
  })
  @IsOptional()
  @IsString()
  shipmentRequestStatus?: string;

  @ApiProperty({
    example: 'Pending',
    description: 'Current shipment status',
    required: false,
  })
  @IsOptional()
  @IsString()
  shipmentStatus?: string;

  @ApiProperty({
    example: 'INV123456',
    description: 'Invoice reference or number',
    required: false,
  })
  @IsOptional()
  @IsString()
  invoice?: string;

  @ApiProperty({
    example: 'No Refund',
    description: 'Current refund status',
    required: false,
  })
  @IsOptional()
  @IsString()
  refundStatus?: string;

  @ApiProperty({
    example: 'Refund processed on 2024-10-01.',
    description: 'Details of the refund, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  refundDetails?: string;

  @ApiProperty({
    example: 10.5,
    description: 'Shipping cost associated with the order',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @ApiProperty({
    example: 'Pending',
    description: 'Current order status',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderingStatus?: string;

  @ApiProperty({
    example: 'Unfulfilled',
    description: 'Order fulfillment status',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderFulfillmentStatus?: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if pre-payment was made',
  })
  @IsBoolean()
  prePayment: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if the order has been fully paid',
  })
  @IsBoolean()
  paymentStatus: boolean;

  @ApiProperty({
    example: 100.0,
    description: 'Total item cost after discounts, if applicable',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalItemCost?: number;

  @ApiProperty({
    example: 110.0,
    description: 'Total order cost including shipping and discounts',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalOrderCost?: number;
}


