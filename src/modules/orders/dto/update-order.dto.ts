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

class OrderedItemDto {
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
}

export class UpdateOrderDto {
  @ApiProperty({
    description:
      'List of ordered items including productId, quantity, and assignedUnits',
    type: [OrderedItemDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderedItemDto)
  orderedItems?: OrderedItemDto[];

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
    example: '164, Kolkata',
    description: 'Address',
    required: true,
  })
  @IsString()
  @IsOptional()
  address: string;

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
    description: 'Shipping cost for the order',
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
    description: 'Whether pre-payment was made',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  prePayment?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the order has been paid for',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  paymentStatus?: boolean;
}
