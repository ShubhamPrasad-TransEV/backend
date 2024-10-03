import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
