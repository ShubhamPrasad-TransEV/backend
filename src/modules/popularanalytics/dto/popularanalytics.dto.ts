import { IsOptional, IsString, IsInt } from 'class-validator';
import { IsBigInt } from './isbigint.validator'; // Adjust the path as necessary

export class CreateMostlySearchedDto {
  @IsOptional()
  @IsString()
  productid?: string; // Optional field for product ID

  @IsOptional()
  @IsBigInt() // Use custom BigInt validator
  numberofsearch?: bigint; // Optional field for number of searches

  // createdAt and updatedAt are typically managed by the database
}

export class CreateMostlyViewedDto {
  @IsOptional()
  @IsString()
  productId?: string; // Optional field for product ID

  @IsOptional()
  @IsBigInt() // Use integer for views as Prisma supports integers better
  views?: number; // Optional field for number of views

  @IsOptional()
  @IsInt()
  limit?: number; // Optional limit for number of top entries to return
}
