import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
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
    example: true,
    description: 'Updated payment status',
    required: false,
  })
  paymentStatus?: boolean;
}
