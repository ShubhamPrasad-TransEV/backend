import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'User ID who is placing the order',
  })
  @IsNumber()
  userId: number;

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
  })
  @IsBoolean()
  prePayment: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the order has been paid for',
  })
  @IsBoolean()
  paymentStatus: boolean;
}
