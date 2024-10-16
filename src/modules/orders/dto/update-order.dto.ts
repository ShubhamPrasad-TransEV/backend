import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: 'DHL',
    description: 'Updated shipment company',
    required: false,
  })
  shipmentCompany?: string;

  @ApiProperty({
    example: 'Shipped',
    description: 'Updated shipment status',
    required: false,
  })
  shipmentStatus?: string;

  @ApiProperty({
    example: 'Fulfilled',
    description: 'Updated order fulfillment status',
    required: false,
  })
  orderFulfillmentStatus?: string;

  @ApiProperty({
    example: 'Refunded',
    description: 'Updated refund status',
    required: false,
  })
  refundStatus?: string;

  @ApiProperty({
    example: 'Refund processed on 2024-10-10.',
    description: 'Updated refund details',
    required: false,
  })
  refundDetails?: string;

  @ApiProperty({
    example: 'Completed',
    description: 'Updated order status',
    required: false,
  })
  orderingStatus?: string;

  @ApiProperty({
    example: true,
    description: 'Updated payment status',
    required: false,
  })
  paymentStatus?: boolean;

  @ApiProperty({
    example: 5.0,
    description: 'Updated shipping cost for the order',
    required: false,
  })
  shippingCost?: number;

  @ApiProperty({
    example: 2,
    description: 'Updated seller ID associated with the order',
    required: false,
  })
  sellerId?: number;
}
