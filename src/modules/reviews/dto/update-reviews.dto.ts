import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewsDto {
  // Reject userId if provided
  @Type(() => Number)
  @IsOptional({ groups: ['no_userId'] })
  userId?: never;

  // Reject productId if provided
  @Type(() => String)
  @IsOptional({ groups: ['no_productId'] })
  productId?: never;

  @IsOptional()
  @IsString()
  review?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratings?: number;
}
