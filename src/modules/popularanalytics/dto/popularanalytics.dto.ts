import { IsOptional, IsString, IsInt, Min } from 'class-validator'; // Import IsInt and Min
// Remove the import for IsBigInt since it's no longer needed

export class CreateMostlySearchedDto {
  @IsOptional()
  @IsString()
  productid?: string; // Optional field for product ID

  @IsOptional()
  @IsInt() // Use IsInt for integer validation
  @Min(0) // Ensure that the number of searches is a non-negative integer
  numberofsearch?: number; // Change type to number for integer

  // createdAt and updatedAt are typically managed by the database
}
