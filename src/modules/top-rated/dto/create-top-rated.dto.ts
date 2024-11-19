// create-top-rated.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopRatedDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
