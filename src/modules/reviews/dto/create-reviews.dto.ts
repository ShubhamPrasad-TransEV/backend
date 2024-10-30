import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewsDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  review?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratings: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  deliveryRatings: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  dispatchRatings: number;
}
