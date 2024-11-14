import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateOfferProductStockDto {
  @ApiProperty({
    description: 'Offerable product ID to update stock for',
    example: 'offerable-product-uuid',
  })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity of new units to add', example: 10 })
  @IsNumber()
  quantity: number;
}
