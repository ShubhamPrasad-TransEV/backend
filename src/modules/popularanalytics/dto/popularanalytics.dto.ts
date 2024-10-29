import { IsOptional, IsString } from 'class-validator';
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
