import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateMostlySearchedDto {
  @IsOptional()
  @IsString()
  productid?: string; // Optional field for product ID

  @IsOptional()
  @IsInt()
  @Min(0)
  numberofsearch?: number; // Change type to number for integer
}

export class CreateMostlyViewedDto {
  @IsOptional()
  @IsString()
  productId?: string; // Optional field for product ID

  @IsOptional()
  @IsInt()
  views?: number; // Optional field for number of views

  @IsOptional()
  @IsInt()
  limit?: number; // Optional limit for number of top entries to return
}
